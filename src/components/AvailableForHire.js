import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Green "open to work" pill shown at the top of the home hero.
// Styled in styles/home.css, which the Home route imports.
function AvailableForHire() {
  const { t } = useTranslation();
  return (
    <Link
      to="/about#contact"
      className="available-badge"
      aria-label={t("home.availableForHire")}
    >
      <span className="available-dot" aria-hidden="true" />
      <span>{t("home.availableForHire")}</span>
    </Link>
  );
}

export default AvailableForHire;
