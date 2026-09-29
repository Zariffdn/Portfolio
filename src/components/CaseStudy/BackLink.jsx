import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

// Every case study sits under Projects, so every back link goes there. The
// label follows the site language; the case study root is lang="en", so in
// Malay the link names its own language.
function BackLink({ className = "" }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language) === "ms" ? "ms" : undefined;
  return (
    <Link to="/project" className={`link-arrow cs-back ${className}`.trim()} lang={lang}>
      <FiArrowLeft aria-hidden="true" /> {t("caseStudy.back")}
    </Link>
  );
}

export default BackLink;
