import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Section, SectionHeading } from "../ui";
import Timeline from "./Timeline";

// Copy lives under education.<key>.* in the locale files.
const items = [
  { key: "peoplelogy", bullets: ["b1", "b2"] },
  { key: "uitm", bullets: [] },
  { key: "matrikulasi", bullets: [] },
];

function Education() {
  const { t } = useTranslation();

  const entries = items.map(({ key, bullets }) => ({
    id: key,
    period: t(`education.${key}.period`),
    role: t(`education.${key}.role`),
    company: t(`education.${key}.company`),
    meta: t(`education.${key}.meta`),
    bullets: bullets.map((b) => t(`education.${key}.${b}`)),
  }));

  return (
    <Section hairline id="education">
      <Container>
        <SectionHeading
          title={`${t("about.myEducationPre")} ${t("about.myEducationHighlight")}`}
        />
        <Timeline entries={entries} />
      </Container>
    </Section>
  );
}

export default Education;
