import { useTranslation } from "react-i18next";
import { FiGlobe } from "react-icons/fi";
import { Container, Section } from "../ui";
import BackLink from "./BackLink";

// The bar above each case study hero: the back link, plus a note in Malay
// when the site is in Bahasa Malaysia, since the case studies are English only.
function CaseStudyTop() {
  const { t, i18n } = useTranslation();
  const malay = (i18n.resolvedLanguage || i18n.language) === "ms";
  return (
    <Section tight>
      <Container narrow>
        <div className="cs-top cs-rise">
          {malay && (
            <p className="cs-lang-note small" lang="ms">
              <FiGlobe aria-hidden="true" />
              <span>{t("caseStudy.englishOnly")}</span>
            </p>
          )}
          <BackLink />
        </div>
      </Container>
    </Section>
  );
}

export default CaseStudyTop;
