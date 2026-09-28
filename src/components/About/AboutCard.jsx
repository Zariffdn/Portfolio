import { useTranslation } from "react-i18next";
import { Container, Section, Chip, Reveal } from "../ui";

// Jump links under the intro. Each id is the id of a <Section> further down
// About (see About.jsx); the label keys live under about.toc*.
const TOC = [
  ["experience", "about.tocExperience"],
  ["education", "about.tocEducation"],
  ["certifications", "about.tocCertifications"],
  ["skills", "about.tocSkills"],
  ["faq", "about.tocFaq"],
  ["contact", "about.tocContact"],
];

// Work setups listed under "Looking for", as aboutCard.<key>.
const SETUPS = ["workRemote", "workHybrid", "workOnsite"];

// Intro: the page's single h1, the bio prose, the "On this page" jump links,
// and an aside with location, languages and the kind of role he is after.
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

            <nav className="about-toc" aria-labelledby="about-toc-label">
              <span
                id="about-toc-label"
                className="eyebrow eyebrow--plain about-toc__label"
              >
                {t("about.tocLabel")}
              </span>
              <ul className="chip-row about-toc__list" role="list">
                {TOC.map(([id, key]) => (
                  <li key={id}>
                    <a href={`#${id}`} className="chip about-toc__link">
                      {t(key)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          <Reveal delay={0.12} className="surface about-aside">
            <dl className="meta-list">
              <dt>{t("aboutCard.metaLocationLabel")}</dt>
              <dd>{t("aboutCard.metaLocationValue")}</dd>
              <dt>{t("aboutCard.metaLanguagesLabel")}</dt>
              <dd>{t("aboutCard.metaLanguagesValue")}</dd>
            </dl>

            <div className="about-aside__block about-aside__looking">
              <h2 className="eyebrow eyebrow--plain about-aside__label">
                {t("aboutCard.lookingForLabel")}
              </h2>
              <p className="about-aside__role">{t("aboutCard.lookingForRole")}</p>
              <ul className="chip-row" role="list">
                {SETUPS.map((key) => (
                  <li key={key}>
                    <Chip>{t(`aboutCard.${key}`)}</Chip>
                  </li>
                ))}
              </ul>
              <p className="text-3 small">{t("aboutCard.lookingForNotice")}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export default AboutCard;
