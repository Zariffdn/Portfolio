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
      aria-label={`${t("home.availableForHire")}, ${t("home.availableNotice")}`}
    >
      <span className="available-dot" aria-hidden="true" />
      {/* Two parts that wrap as units, so a narrow screen breaks the badge
          between them rather than inside either. */}
      <span className="available-badge__text">
        <span className="available-badge__part">{t("home.availableForHire")}</span>{" "}
        <span className="available-badge__part available-badge__notice">
          {t("home.availableNotice")}
        </span>
      </span>
    </Link>
  );
}

export default AvailableForHire;
