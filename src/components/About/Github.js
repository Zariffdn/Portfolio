import React, { useEffect, useRef, useState } from "react";
import GitHubCalendar from "react-github-calendar";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";
import { Container, Section, SectionHeading, Reveal } from "../ui";
import "../../styles/about-sections.css";

const darkPalette = {
  level0: "rgba(255,255,255,0.06)",
  level1: "#3b2a5e",
  level2: "#5f3fa3",
  level3: "#8d63e0",
  level4: "#b78cff",
};

const lightPalette = {
  level0: "rgba(107,47,217,0.08)",
  level1: "#d9c8f5",
  level2: "#a98ae6",
  level3: "#7a4fd1",
  level4: "#4a17a8",
};

// Narrow screens get smaller blocks so more weeks fit before scrolling.
const COMPACT_QUERY = "(max-width: 480px)";
// The calendar mounts (and fires its request) this far before it scrolls in.
const MOUNT_MARGIN = "400px 0px";
// How often and for how long to look for the rendered svg after mounting.
const SVG_POLL_MS = 100;
const SVG_POLL_LIMIT_MS = 6000;

function isCompactViewport() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(COMPACT_QUERY).matches
  );
}

function Github() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const palette = theme === "light" ? lightPalette : darkPalette;
  const surfaceRef = useRef(null);
  const [shouldMount, setShouldMount] = useState(false);
  const [compact, setCompact] = useState(isCompactViewport);
  const calendarLabel =
    t("about.daysICodePre") + " " + t("about.daysICodeHighlight");

  // The surface renders at once (its min-height keeps the page stable) but
  // the calendar itself waits until the surface is near the viewport.
  useEffect(() => {
    const node = surfaceRef.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setShouldMount(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: MOUNT_MARGIN }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onResize = () => setCompact(isCompactViewport());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Once the calendar has drawn its svg, scroll the surface to its end so the
  // most recent weeks are the ones visible on narrow screens. The library
  // swaps its loading skeleton for the real svg when data arrives, so each
  // new svg node snaps again; the wrapper's ResizeObserver covers later
  // viewport changes (rotation, block size switch, error text).
  useEffect(() => {
    if (!shouldMount) return undefined;
    const node = surfaceRef.current;
    if (!node) return undefined;

    const snapToEnd = () => {
      node.scrollLeft = node.scrollWidth;
    };

    const started = Date.now();
    let timer = null;
    let lastSvg = null;
    const poll = () => {
      const svg = node.querySelector("svg");
      if (svg && svg !== lastSvg) {
        lastSvg = svg;
        snapToEnd();
      }
      if (Date.now() - started < SVG_POLL_LIMIT_MS) {
        timer = window.setTimeout(poll, SVG_POLL_MS);
      }
    };
    poll();

    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(snapToEnd);
      resizeObserver.observe(node);
    }

    return () => {
      if (timer !== null) window.clearTimeout(timer);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [shouldMount]);

  return (
    <Section tight>
      <Container>
        <SectionHeading title={calendarLabel} />
        <Reveal>
          <div
            ref={surfaceRef}
            className="surface gh__surface"
            tabIndex={0}
            role="region"
            aria-label={calendarLabel}
          >
            {shouldMount ? (
              <GitHubCalendar
                username="Zariffdn"
                blockSize={compact ? 10 : 13}
                blockMargin={compact ? 3 : 4}
                theme={palette}
                fontSize={14}
              />
            ) : null}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export default Github;
