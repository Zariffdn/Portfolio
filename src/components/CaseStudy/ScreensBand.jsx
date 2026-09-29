import { useEffect, useRef, useState } from "react";
import { Stagger } from "../ui";

// The row of phone screenshots under a case study hero. Under 880px the row
// scrolls sideways (casestudy.css), and only while it actually overflows is
// it a Tab stop: a keyboard user needs to focus a scroller to reach the
// other screens (WCAG 2.1.1), while a row that fits would be a dead stop.
// The check reruns whenever the band's own size changes.
function ScreensBand({ label, children }) {
  const ref = useRef(null);
  const [scrolls, setScrolls] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const check = () => setScrolls(el.scrollWidth - el.clientWidth > 1);
    check();
    // Without ResizeObserver the first measurement stands.
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Stagger
      ref={ref}
      className="cs-screens"
      gap={0.1}
      role="region"
      aria-label={label}
      tabIndex={scrolls ? 0 : undefined}
    >
      {children}
    </Stagger>
  );
}

export default ScreensBand;
