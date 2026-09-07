import React from "react";
import { useTranslation } from "react-i18next";
import { CgCPlusPlus } from "react-icons/cg";
import {
  DiJavascript1,
  DiReact,
  DiNodejs,
  DiPython,
  DiGit,
  DiJava,
} from "react-icons/di";
import {
  SiFirebase,
  SiBootstrap,
  SiFlutter,
  SiDart,
  SiVisualstudiocode,
  SiArduino,
  SiAndroidstudio,
  SiNpm,
  SiGithub,
  SiGradle,
  SiPostman,
} from "react-icons/si";
import { FaDatabase, FaPhp } from "react-icons/fa";
import {
  Container,
  Section,
  SectionHeading,
  Chip,
  Stagger,
  StaggerItem,
} from "../ui";
import "../../styles/about-sections.css";

// Languages and frameworks. To add one, append { name, Icon }.
const techs = [
  { name: "Flutter", Icon: SiFlutter },
  { name: "Dart", Icon: SiDart },
  { name: "C++", Icon: CgCPlusPlus },
  { name: "JavaScript", Icon: DiJavascript1 },
  { name: "Node.js", Icon: DiNodejs },
  { name: "React", Icon: DiReact },
  { name: "PHP", Icon: FaPhp },
  { name: "MySQL", Icon: FaDatabase },
  { name: "Git", Icon: DiGit },
  { name: "Firebase", Icon: SiFirebase },
  { name: "Bootstrap", Icon: SiBootstrap },
  { name: "Python", Icon: DiPython },
  { name: "Java", Icon: DiJava },
];

// Editors, build tools and services used day to day.
const tools = [
  { name: "VS Code", Icon: SiVisualstudiocode },
  { name: "npm", Icon: SiNpm },
  { name: "GitHub", Icon: SiGithub },
  { name: "Gradle", Icon: SiGradle },
  { name: "Android Studio", Icon: SiAndroidstudio },
  { name: "Arduino", Icon: SiArduino },
  { name: "Postman", Icon: SiPostman },
];

function ChipGroup({ label, items }) {
  return (
    <div className="stack__group">
      <span className="eyebrow stack__label">{label}</span>
      <Stagger className="chip-row" gap={0.035}>
        {items.map(({ name, Icon }) => (
          <StaggerItem key={name} y={10}>
            <Chip icon={<Icon />} tabIndex={0} aria-label={name}>
              {name}
            </Chip>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

function Stack() {
  const { t } = useTranslation();

  return (
    <Section hairline className="stack">
      <Container>
        <SectionHeading
          title={`${t("about.skillsetPre")} ${t("about.skillsetHighlight")}`}
          lead={t(
            "about.stackLead",
            "Languages, frameworks and the tools around them."
          )}
        />
        <ChipGroup label={t("uses.languages")} items={techs} />
        <ChipGroup label={t("about.toolsHighlight")} items={tools} />
      </Container>
    </Section>
  );
}

export default Stack;
