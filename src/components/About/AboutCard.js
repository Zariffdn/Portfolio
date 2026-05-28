import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";
import { useTranslation } from "react-i18next";

function AboutCard() {
  const { t } = useTranslation();
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            {t("aboutCard.intro_pre")}{" "}
            <span className="purple">{t("aboutCard.intro_name")} </span>
            {t("aboutCard.intro_from")}{" "}
            <span className="purple"> {t("aboutCard.intro_location")}</span>
            <br /> {t("aboutCard.degree")}
            <br />
            <br />
            {t("aboutCard.currentRole_pre")}
            <span className="purple"> {t("aboutCard.currentRole_title")}</span>{" "}
            {t("aboutCard.currentRole_at")}
            <span className="purple"> {t("aboutCard.currentRole_company")}</span>{" "}
            {t("aboutCard.currentRole_post")}
            <span className="purple"> {t("aboutCard.currentRole_prevCompany")}</span>{" "}
            {t("aboutCard.currentRole_end")}
            <br />
            <br />
            {t("aboutCard.hobbies")}
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> {t("aboutCard.playingGames")}
            </li>
            <li className="about-activity">
              <ImPointRight /> {t("aboutCard.workingOut")}
            </li>
            <li className="about-activity">
              <ImPointRight /> {t("aboutCard.listeningMusic")}
            </li>
          </ul>

          <dl className="about-card-meta">
            <div className="about-card-meta-row">
              <dt>{t("aboutCard.metaLocationLabel")}</dt>
              <dd>{t("aboutCard.metaLocationValue")}</dd>
            </div>
            <div className="about-card-meta-row">
              <dt>{t("aboutCard.metaLanguagesLabel")}</dt>
              <dd>{t("aboutCard.metaLanguagesValue")}</dd>
            </div>
          </dl>

          <p style={{ color: "var(--quote-text)" }}>
            {t("aboutCard.quote")}{" "}
          </p>
          <footer className="blockquote-footer">Zariff</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
