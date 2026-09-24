import { useEffect, useRef, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";
import { Container, Section, SectionHeading, Reveal } from "../ui";
import "../../styles/about-sections.css";

// Five levels each, from empty to busiest. The calendar takes both palettes
// at once and colorScheme picks the active one.
const palette = {
  dark: [
    "rgba(255,255,255,0.06)",
    "#3b2a5e",
    "#5f3fa3",
    "#8d63e0",
    "#b78cff",
  ],
  light: [
    "rgba(107,47,217,0.08)",
    "#d9c8f5",
    "#a98ae6",
    "#7a4fd1",
    "#4a17a8",
  ],
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
  const surfaceRef = useRef(null);
  // Without IntersectionObserver there is nothing to wait for.
  const [shouldMount, setShouldMount] = useState(
    () => typeof IntersectionObserver === "undefined"
  );
  const [compact, setCompact] = useState(isCompactViewport);
  const calendarLabel =
    t("about.daysICodePre") + " " + t("about.daysICodeHighlight");

  // The surface renders at once (its min-height keeps the page stable) but
  // the calendar itself waits until the surface is near the viewport.
  useEffect(() => {
    const node = surfaceRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
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
        <SectionHeading
          title={calendarLabel}
          lead={t("about.calendarLead")}
        />
        <Reveal>
          <div
            ref={surfaceRef}
            className="surface gh__surface"
            // The surface scrolls horizontally, so keyboard users need to be
            // able to focus it to reach the older weeks (WCAG 2.1.1).
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
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
                colorScheme={theme === "light" ? "light" : "dark"}
                errorMessage={t("about.calendarError")}
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
