import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { scrollBehavior } from "../utils/motion";
import { focusQuietly } from "./ScrollToTop";

// `inert` is set while the mobile menu covers the page.
function BackToTop({ inert = false }) {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Glides up normally, jumps under prefers-reduced-motion. Focus goes to the
  // page's h1 (the button hides itself at the top), so the next Tab starts
  // there instead of at the footer.
  const goTop = () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
    const main = document.getElementById("main");
    if (main) focusQuietly(main.querySelector("h1") || main);
  };

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label={t("backToTop", "Back to top")}
      className={`back-to-top ${visible ? "is-visible" : ""}`}
      inert={inert}
    >
      <FiArrowUp />
    </button>
  );
}

export default BackToTop;
