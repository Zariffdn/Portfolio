import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { readStorage, writeStorage } from "../utils/storage";

const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });

// Must match --bg-0 in src/styles/tokens.css for each theme.
const THEME_COLOR = { dark: "#09060f", light: "#faf8fd" };

// A browser that blocks site data throws on localStorage itself; that must
// fall back to the OS preference, never blank the site. readStorage and
// writeStorage swallow the error.
function getInitialTheme() {
  if (typeof window === "undefined") return "dark";
  const stored = readStorage("localStorage", "theme");
  if (stored === "light" || stored === "dark") return stored;
  try {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  } catch {
    return "dark";
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStorage("localStorage", "theme", theme);
    // The browser chrome colour follows the in-app toggle, not only the OS.
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((m) => m.setAttribute("content", THEME_COLOR[theme]));
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    []
  );

  // One value object per theme, so consumers re-render on a theme change and
  // not on every render of the provider's parent (App renders again whenever
  // the mobile menu opens or closes).
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
