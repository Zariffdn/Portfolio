import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Section, SectionHeading } from "../ui";
import StoreLinks from "../StoreLinks";
import Timeline from "./Timeline";

// Copy lives under experience.<key>.* in the locale files. `links` marks the
// entry that shows the MyTax store buttons.
const keys = [
  { key: "zen", bullets: ["b1", "b2", "b3", "b4"], links: true },
  { key: "bestinet", bullets: ["b1", "b2", "b3", "b4"], links: false },
];

function Experience() {
  const { t } = useTranslation();

  const entries = keys.map(({ key, bullets, links }) => ({
    id: key,
    period: t(`experience.${key}.period`),
    role: t(`experience.${key}.role`),
    company: t(`experience.${key}.company`),
    meta: t(`experience.${key}.meta`),
    bullets: bullets.map((b) => t(`experience.${key}.${b}`)),
    extra: links ? (
      <div className="tl__extra">
        <span className="eyebrow eyebrow--plain">{t("about.availableOn")}</span>
        <StoreLinks compact />
      </div>
    ) : null,
  }));

  return (
    <Section hairline id="experience">
      <Container>
        <SectionHeading
          title={`${t("about.myExperiencePre")} ${t("about.myExperienceHighlight")}`}
        />
        <Timeline entries={entries} />
      </Container>
    </Section>
  );
}

export default Experience;
