import React from "react";
import { useTranslation } from "react-i18next";

function AvailableForHire() {
  const { t } = useTranslation();
  return (
    <a
      href="mailto:zariffdanial.zul@gmail.com"
      className="available-badge"
      aria-label={t("home.availableForHire")}
    >
      <span className="available-dot" />
      <span>{t("home.availableForHire")}</span>
    </a>
  );
}

export default AvailableForHire;
