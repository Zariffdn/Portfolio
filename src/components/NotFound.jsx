import { useTranslation } from "react-i18next";
import { FiArrowLeft, FiDownload } from "react-icons/fi";
import "../styles/notfound.css";
import { Container, Section, Button } from "./ui";
import usePageMeta from "../hooks/usePageMeta";

// The stable public copy of the resume (public/Zariff-Danial-Resume.pdf).
const RESUME_URL = "/Zariff-Danial-Resume.pdf";

function NotFound() {
  const { t } = useTranslation();

  usePageMeta({
    title: t("meta.notFound"),
    description: t("meta.notFoundDesc"),
    noindex: true,
  });

  return (
    <Section className="notfound">
      <Container>
        <div className="notfound__content">
          <span className="eyebrow eyebrow--plain">
            {t("notFound.eyebrow", "Error 404")}
          </span>
          <h1>{t("notFound.title")}</h1>
          <p className="lead notfound__desc">{t("notFound.desc")}</p>
          {/* A dead inbound link is most often an old resume or project
              address, so those two are offered beside home. */}
          <div className="notfound__actions">
            <Button to="/" variant="primary" icon={<FiArrowLeft />} iconPosition="start">
              {t("notFound.takeMeHome")}
            </Button>
            <Button to="/project" variant="ghost">
              {t("home.ctaWork")}
            </Button>
            <Button
              href={RESUME_URL}
              variant="ghost"
              icon={<FiDownload />}
              iconPosition="start"
              download
            >
              {t("resume.download")}
            </Button>
          </div>
        </div>
      </Container>

      <span className="notfound__numeral" aria-hidden="true">
        404
      </span>
    </Section>
  );
}

export default NotFound;
