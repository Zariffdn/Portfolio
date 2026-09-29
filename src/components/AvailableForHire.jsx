import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Green "open to work" pill shown at the top of the home hero.
// Styled in styles/home.css, which the Home route imports. The notice period
// is left to the About aside, the FAQ and the closing CTA band, so the first
// line a visitor reads is the offer itself.
function AvailableForHire() {
  const { t } = useTranslation();
  return (
    <Link to="/about#contact" className="available-badge">
      <span className="available-dot" aria-hidden="true" />
      {t("home.availableForHire")}
    </Link>
  );
}

export default AvailableForHire;
