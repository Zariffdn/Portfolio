import { useId } from "react";
import { useTranslation } from "react-i18next";
import { FiDownload } from "react-icons/fi";
import { Container, Section, Button, Reveal } from "./ui";
import "../styles/cta-band.css";

const EMAIL = "zariffdanial.zul@gmail.com";

// The stable public copy of the resume (public/Zariff-Danial-Resume.pdf).
const RESUME_URL = "/Zariff-Danial-Resume.pdf";

// Closing call to action: eyebrow, heading, one line on the kind of role he
// is after, a button to the contact form on About, and the email address.
// resume adds a secondary button that downloads the CV; flushTop drops the
// top padding when the section above already ends in a full section gap.
// Used at the end of Home and of /project.
function CtaBand({ resume = false, flushTop = false }) {
  const { t } = useTranslation();
  const titleId = useId();

  return (
    <Section aria-labelledby={titleId} flushTop={flushTop}>
      <Container>
        <Reveal>
          <div className="surface cta-band">
            <span className="eyebrow eyebrow--plain">{t("home.ctaEyebrow")}</span>
            <h2 id={titleId}>{t("home.ctaTitle")}</h2>
            <p className="lead">{t("home.ctaBody")}</p>
            <div className="cta-band__actions">
              <Button to="/about#contact" variant="accent" size="lg">
                {t("home.ctaButton")}
              </Button>
              {resume && (
                <Button
                  href={RESUME_URL}
                  variant="ghost"
                  size="lg"
                  icon={<FiDownload />}
                  iconPosition="start"
                  download
                >
                  {t("resume.download")}
                </Button>
              )}
            </div>
            <a
              href={"mailto:" + EMAIL}
              className="cta-band__email mono small text-3"
            >
              {t("home.ctaEmail")}
            </a>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export default CtaBand;
