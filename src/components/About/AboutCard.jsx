import { useTranslation } from "react-i18next";
import { FiActivity, FiMusic } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";
import { Container, Section, Chip, Reveal } from "../ui";
import photo480 from "../../Assets/me-480.jpg";
import photo960 from "../../Assets/me-960.jpg";

// Intro: the page's single h1, the bio prose, and an aside with the photo,
// location, languages, off-the-clock chips and the quote. The photo is a
// square head-and-shoulders crop at 480 and 960 px.
function AboutCard() {
  const { t } = useTranslation();

  return (
    <Section className="about-intro" id="intro">
      <Container>
        <div className="about-intro__grid">
          <Reveal className="about-intro__copy">
            <span className="eyebrow">{t("home.aboutEyebrow")}</span>
            <h1>{t("home.aboutTitle")}</h1>
            <div className="prose">
              <p>
                {t("aboutCard.intro_pre")} <em>{t("aboutCard.intro_name")}</em>{" "}
                {t("aboutCard.intro_from")} <em>{t("aboutCard.intro_location")}</em>{" "}
                {t("aboutCard.degree")}
              </p>
              <p>
                {t("aboutCard.currentRole_pre")}{" "}
                <em>{t("aboutCard.currentRole_title")}</em>{" "}
                {t("aboutCard.currentRole_at")}{" "}
                <em>{t("aboutCard.currentRole_company")}</em>{" "}
                {t("aboutCard.currentRole_post")}{" "}
                <em>{t("aboutCard.currentRole_prevCompany")}</em>{" "}
                {t("aboutCard.currentRole_end")}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="surface about-aside">
            <img
              className="about-aside__photo"
              src={photo480}
              srcSet={`${photo480} 480w, ${photo960} 960w`}
              sizes="(max-width: 899px) min(400px, calc(100vw - 90px)), 410px"
              width="480"
              height="480"
              alt={t("aboutCard.intro_name")}
              decoding="async"
            />
            <dl className="meta-list">
              <dt>{t("aboutCard.metaLocationLabel")}</dt>
              <dd>{t("aboutCard.metaLocationValue")}</dd>
              <dt>{t("aboutCard.metaLanguagesLabel")}</dt>
              <dd>{t("aboutCard.metaLanguagesValue")}</dd>
            </dl>

            <div className="about-aside__block">
              <span className="eyebrow eyebrow--plain about-aside__label">
                {t("aboutCard.hobbiesLabel", "Off the clock")}
              </span>
              <div className="chip-row">
                <Chip icon={<IoGameControllerOutline />}>
                  {t("aboutCard.playingGames")}
                </Chip>
                <Chip icon={<FiActivity />}>{t("aboutCard.workingOut")}</Chip>
                <Chip icon={<FiMusic />}>{t("aboutCard.listeningMusic")}</Chip>
              </div>
            </div>

            <figure className="about-aside__quote">
              <blockquote>
                <p>{t("aboutCard.quote")}</p>
              </blockquote>
              <figcaption className="about-aside__cite">Zariff</figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export default AboutCard;
