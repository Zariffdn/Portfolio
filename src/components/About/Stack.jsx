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
  SiArduino,
  SiAndroidstudio,
  SiNpm,
  SiGithub,
  SiGradle,
  SiPostman,
  SiTypescript,
  SiExpo,
  SiSupabase,
  SiFigma,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { FaDatabase, FaPhp } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import Huawei from "../icons/Huawei";
import {
  Container,
  Section,
  SectionHeading,
  Chip,
  Stagger,
  StaggerItem,
} from "../ui";
import "../../styles/about-sections.css";

// Flutter and the packages the two case studies name (MyTax and Bestinet).
// Packages without a mark of their own share the generic package glyph.
const mobile = [
  { name: "Flutter", Icon: SiFlutter },
  { name: "Dart", Icon: SiDart },
  { name: "Provider", Icon: FiPackage },
  { name: "GetX", Icon: FiPackage },
  { name: "Dio", Icon: FiPackage },
  { name: "Firebase Messaging", Icon: SiFirebase },
  { name: "Huawei Push Kit", Icon: Huawei },
  { name: "flutter_secure_storage", Icon: FiPackage },
  { name: "local_auth", Icon: FiPackage },
];

// Languages and frameworks. To add one, append { name, Icon }.
const techs = [
  { name: "TypeScript", Icon: SiTypescript },
  { name: "JavaScript", Icon: DiJavascript1 },
  { name: "React", Icon: DiReact },
  { name: "React Native", Icon: DiReact },
  { name: "Expo", Icon: SiExpo },
  { name: "Node.js", Icon: DiNodejs },
  { name: "Supabase", Icon: SiSupabase },
  { name: "Firebase", Icon: SiFirebase },
  { name: "C++", Icon: CgCPlusPlus },
  { name: "PHP", Icon: FaPhp },
  { name: "MySQL", Icon: FaDatabase },
  { name: "Git", Icon: DiGit },
  { name: "Bootstrap", Icon: SiBootstrap },
  { name: "Python", Icon: DiPython },
  { name: "Java", Icon: DiJava },
];

// Editors, build tools and services used day to day.
const tools = [
  { name: "VS Code", Icon: VscVscode },
  { name: "Android Studio", Icon: SiAndroidstudio },
  { name: "GitHub", Icon: SiGithub },
  { name: "Postman", Icon: SiPostman },
  { name: "Figma", Icon: SiFigma },
  { name: "Gradle", Icon: SiGradle },
  { name: "npm", Icon: SiNpm },
  { name: "Arduino", Icon: SiArduino },
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
        <ChipGroup label={t("about.stackMobile")} items={mobile} />
        <ChipGroup label={t("uses.languages")} items={techs} />
        <ChipGroup label={t("about.toolsHighlight")} items={tools} />
      </Container>
    </Section>
  );
}

export default Stack;
