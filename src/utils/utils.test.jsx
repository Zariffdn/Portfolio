// The chunk-reload path and the helpers under it, which no browser sweep can
// reach: the guarded storage helpers, reloadOnce and lazyPreload, plus
// formatMonth.

import { Component, Suspense } from "react";
import { act, render, screen } from "@testing-library/react";
import { readStorage, writeStorage } from "./storage";
import reloadOnce from "./reload";
import lazyPreload, { retryFailedRoutes } from "./lazyPreload";
import { formatMonth } from "./formatMonth";

const RELOAD_KEY = "chunk-reload-at";

// A browser that blocks site data throws on the storage getter itself.
function blockStorage(area) {
  return vi.spyOn(window, area, "get").mockImplementation(() => {
    throw new Error(`${area} is blocked`);
  });
}

describe("storage helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    window.sessionStorage.clear();
  });

  it("read and write the named area", () => {
    expect(writeStorage("sessionStorage", "k", "v")).toBe(true);
    expect(readStorage("sessionStorage", "k")).toBe("v");
    expect(readStorage("sessionStorage", "missing")).toBeNull();
  });

  it("report null and false, without throwing, when the area itself throws", () => {
    blockStorage("sessionStorage");
    expect(readStorage("sessionStorage", "k")).toBeNull();
    expect(writeStorage("sessionStorage", "k", "v")).toBe(false);
  });

  it("report false when a write is refused", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(writeStorage("localStorage", "k", "v")).toBe(false);
  });
});

describe("reloadOnce", () => {
  let reload;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-29T09:00:00Z"));
    window.sessionStorage.clear();
    reload = vi.fn();
    vi.stubGlobal("location", { reload });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
    window.sessionStorage.clear();
  });

  it("reloads once, then not again within 10 s, then once more", () => {
    expect(reloadOnce()).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
    expect(window.sessionStorage.getItem(RELOAD_KEY)).toBe(String(Date.now()));

    vi.advanceTimersByTime(9999);
    expect(reloadOnce()).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(2);
    expect(reloadOnce()).toBe(true);
    expect(reload).toHaveBeenCalledTimes(2);
  });

  it("never reloads offline", () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    expect(reloadOnce()).toBe(false);
    expect(reload).not.toHaveBeenCalled();
    expect(window.sessionStorage.getItem(RELOAD_KEY)).toBeNull();
  });

  it("never reloads when sessionStorage cannot be written", () => {
    blockStorage("sessionStorage");
    expect(reloadOnce()).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });
});

describe("lazyPreload", () => {
  const Page = () => <p>page loaded</p>;
  const module = { default: Page };

  class Boundary extends Component {
    constructor(props) {
      super(props);
      this.state = { failed: false };
    }
    static getDerivedStateFromError() {
      return { failed: true };
    }
    render() {
      return this.state.failed ? <p>route failed</p> : this.props.children;
    }
  }

  const mount = (Route, key) =>
    render(
      <Boundary key={key}>
        <Suspense fallback={<p>fallback</p>}>
          <Route />
        </Suspense>
      </Boundary>
    );

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    window.sessionStorage.clear();
  });

  it("fetches the module once and renders it synchronously after preload()", async () => {
    const load = vi.fn(() => Promise.resolve(module));
    const Route = lazyPreload(load);
    await Route.preload();
    await Route.preload();
    expect(load).toHaveBeenCalledTimes(1);

    mount(Route);
    // Straight from the module: no fallback, no await.
    expect(screen.getByText("page loaded")).toBeInTheDocument();
    expect(screen.queryByText("fallback")).toBeNull();
  });

  it("suspends on a first render that was not warmed up", async () => {
    const Route = lazyPreload(() => Promise.resolve(module));
    mount(Route);
    expect(screen.getByText("fallback")).toBeInTheDocument();
    expect(await screen.findByText("page loaded")).toBeInTheDocument();
  });

  it("lets a failed warm-up be fetched again", async () => {
    const load = vi
      .fn()
      .mockRejectedValueOnce(new Error("chunk missing"))
      .mockResolvedValue(module);
    const Route = lazyPreload(load);
    await expect(Route.preload()).rejects.toThrow("chunk missing");
    await expect(Route.preload()).resolves.toBe(module);
    expect(load).toHaveBeenCalledTimes(2);
  });

  // A chunk that cannot be fetched rejects with a TypeError in every engine.
  const chunkMissing = () => new TypeError("Failed to fetch dynamically imported module");

  it("reloads the page when a render needs a chunk that failed, keeping the fallback up", async () => {
    const reload = vi.fn();
    vi.stubGlobal("location", { reload });
    const Route = lazyPreload(() => Promise.reject(chunkMissing()));

    mount(Route);
    await act(async () => {});
    expect(reload).toHaveBeenCalledTimes(1);
    expect(screen.getByText("fallback")).toBeInTheDocument();
    expect(screen.queryByText("route failed")).toBeNull();
  });

  it("sends a module that throws as it runs to the boundary at once, without a reload", async () => {
    const reload = vi.fn();
    vi.stubGlobal("location", { reload });
    // React reports an error a boundary caught through console.error.
    vi.spyOn(console, "error").mockImplementation(() => {});
    const Route = lazyPreload(() => Promise.reject(new Error("module threw")));

    mount(Route);
    expect(await screen.findByText("route failed")).toBeInTheDocument();
    expect(reload).not.toHaveBeenCalled();
  });

  it("hands the failure to the error boundary when it cannot reload, and retries after a navigation", async () => {
    // Offline, so reloadOnce() declines and the error reaches the boundary.
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    // React reports an error a boundary caught through console.error.
    vi.spyOn(console, "error").mockImplementation(() => {});
    const load = vi
      .fn()
      .mockRejectedValueOnce(chunkMissing())
      .mockResolvedValue(module);
    const Route = lazyPreload(load);

    const { unmount } = mount(Route, "first");
    expect(await screen.findByText("route failed")).toBeInTheDocument();
    unmount();

    // What RouteErrorBoundary does after the pathname changes.
    retryFailedRoutes();
    mount(Route, "second");
    expect(await screen.findByText("page loaded")).toBeInTheDocument();
    expect(load).toHaveBeenCalledTimes(2);
  });
});

describe("formatMonth", () => {
  it("renders a YYYY-MM month in the active language", () => {
    expect(formatMonth("2025-07", "en")).toBe("July 2025");
    expect(formatMonth("2025-07", "ms")).toBe("Julai 2025");
  });

  it("passes anything malformed through unchanged", () => {
    expect(formatMonth("2025-13", "en")).toBe("2025-13");
    expect(formatMonth("soon", "en")).toBe("soon");
    expect(formatMonth(undefined, "en")).toBeUndefined();
  });
});
