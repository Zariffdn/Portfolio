import React from "react";
import { useTranslation } from "react-i18next";
import { FiArrowLeft } from "react-icons/fi";
import "../styles/notfound.css";
import { Container, Section, Button } from "./ui";
import usePageMeta from "../hooks/usePageMeta";

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
          <Button
            to="/"
            variant="primary"
            icon={<FiArrowLeft />}
            iconPosition="start"
            className="notfound__cta"
          >
            {t("notFound.takeMeHome")}
          </Button>
        </div>
      </Container>

      <span className="notfound__numeral" aria-hidden="true">
        404
      </span>
    </Section>
  );
}

export default NotFound;
