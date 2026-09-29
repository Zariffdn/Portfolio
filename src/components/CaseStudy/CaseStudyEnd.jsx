import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { Reveal } from "../ui";
import BackLink from "./BackLink";
import { nextStudy } from "./studies";

// Closes every case study: a contact line, the next study in the chain from
// studies.js, then the way back to Projects. The contact line reuses the Home
// CTA band's title and link label (home.ctaTitle, home.ctaContact), so the
// hiring wording has one source in both languages. This chrome follows the
// site language while the study body, title and teaser stay English, so in
// Malay the localised elements carry lang="ms" inside the lang="en" root.
function CaseStudyEnd({ current }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language) === "ms" ? "ms" : undefined;
  const next = nextStudy(current);
  return (
    <Reveal className="cs-end">
      <p className="cs-contact" lang={lang}>
        {t("home.ctaTitle")}{" "}
        <Link to="/about#contact" className="link-arrow">
          {t("home.ctaContact")} <FiArrowRight aria-hidden="true" />
        </Link>
      </p>
      {next && (
        <Link to={next.path} className="surface surface--interactive cs-next">
          <span className="cs-next__body">
            <span className="eyebrow eyebrow--plain cs-next__eyebrow" lang={lang}>
              {t("caseStudy.next")}
            </span>
            <span className="cs-next__title">{next.title}</span>
            <span className="cs-next__teaser text-2">{next.teaser}</span>
          </span>
          <span className="cs-next__arrow" aria-hidden="true">
            <FiArrowRight />
          </span>
        </Link>
      )}
      <BackLink />
    </Reveal>
  );
}

export default CaseStudyEnd;
