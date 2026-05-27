import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AvailableForHire() {
  const { t } = useTranslation();
  return (
    <Link
      to="/about#contact"
      className="available-badge"
      aria-label={t("home.availableForHire")}
    >
      <span className="available-dot" />
      <span>{t("home.availableForHire")}</span>
    </Link>
  );
}

export default AvailableForHire;
