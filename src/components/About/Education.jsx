import { useTranslation } from "react-i18next";
import { Container, Section, SectionHeading } from "../ui";
import Timeline from "./Timeline";

// Copy lives under education.<key>.* in the locale files. `tags` are the short
// mono labels rendered as a chip row under the bullets.
const items = [
  {
    key: "peoplelogy",
    bullets: ["b1", "b2"],
    tags: ["t1", "t2", "t3"],
  },
  {
    key: "uitm",
    bullets: ["b1", "b2", "b3", "b4"],
    tags: ["t1", "t2", "t3", "t4", "t5"],
  },
  { key: "matrikulasi", bullets: ["b1", "b2"], tags: ["t1", "t2", "t3"] },
];

function Education() {
  const { t } = useTranslation();

  const entries = items.map(({ key, bullets = [], tags = [] }) => ({
    id: key,
    period: t(`education.${key}.period`),
    role: t(`education.${key}.role`),
    company: t(`education.${key}.company`),
    meta: t(`education.${key}.meta`),
    bullets: bullets.map((b) => t(`education.${key}.${b}`)),
    tags: tags.map((tag) => t(`education.${key}.${tag}`)),
    tagsLabel: t("education.topicsLabel"),
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
