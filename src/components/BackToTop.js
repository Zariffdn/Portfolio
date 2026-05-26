import React, { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { useTranslation } from "react-i18next";

function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label={t("backToTop", "Back to top")}
      className={`back-to-top ${visible ? "is-visible" : ""}`}
    >
      <FiArrowUp />
    </button>
  );
}

export default BackToTop;
