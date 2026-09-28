import { createElement, lazy } from "react";
import reloadOnce from "./reload";

// Routes whose chunk failed to load, each with a function that gives it a
// fresh lazy. React.lazy keeps a rejected result for good, so without this a
// route that failed once would show its error on every later visit without
// asking for another reload. The swap must not happen while React is still
// rendering the failure (a fresh lazy there is retried at once, forever), so
// RouteErrorBoundary calls retryFailedRoutes() after a navigation instead.
const failedRoutes = new Set();

export function retryFailedRoutes() {
  failedRoutes.forEach((reset) => reset());
  failedRoutes.clear();
}

// React.lazy with a preload() handle. Once the module has loaded, whether
// through preload() or through a first render, the component renders its
// loaded module directly instead of going through lazy, so a route that was
// warmed up never suspends and never shows the Suspense fallback.
//
// When a chunk request fails, the warm-ups (App.jsx) simply swallow the
// error. A render that needs the chunk asks reloadOnce() to reload the page
// (usually a tab left open across a redeploy) and keeps the fallback up until
// the reload lands. If it cannot reload, the error reaches the route's error
// boundary.
export default function lazyPreload(load) {
  let Loaded = null;
  let pending = null;
  let Lazy = null;

  const preload = () => {
    if (!pending) {
      pending = load().then(
        (mod) => {
          Loaded = mod.default;
          return mod;
        },
        (error) => {
          pending = null;
          throw error;
        }
      );
    }
    return pending;
  };

  const renderLoad = () =>
    preload().catch((error) => {
      if (reloadOnce()) return new Promise(() => {});
      failedRoutes.add(reset);
      throw error;
    });

  function reset() {
    Lazy = lazy(renderLoad);
  }
  reset();

  function LazyPreload(props) {
    return createElement(Loaded || Lazy, props);
  }
  LazyPreload.preload = preload;
  return LazyPreload;
}
