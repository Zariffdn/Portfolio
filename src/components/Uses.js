import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Particle from "./Particle";
import FadeIn from "./FadeIn";
import usePageMeta from "../hooks/usePageMeta";
import {
  SiVisualstudiocode,
  SiAndroidstudio,
  SiFlutter,
  SiDart,
  SiJavascript,
  SiPhp,
  SiPython,
  SiPostman,
  SiFigma,
  SiNpm,
  SiGradle,
  SiGit,
  SiGithub,
  SiGooglechrome,
  SiArduino,
} from "react-icons/si";
import {
  FaWindows,
  FaJava,
  FaTerminal,
  FaLaptopCode,
  FaMicrochip,
  FaMemory,
} from "react-icons/fa";
import { CgCPlusPlus } from "react-icons/cg";

// Edit any line below to reflect your actual setup. Items with "[edit]" are
// placeholders for things only you can confirm (hardware, specific models, etc.)
const sections = [
  {
    key: "editor",
    items: [
      { Icon: SiVisualstudiocode, label: "VS Code", note: "Default Dark+ theme" },
      { Icon: SiAndroidstudio, label: "Android Studio", note: "For Flutter & Android builds" },
      { Icon: SiGit, label: "Git", note: "Source control" },
      { Icon: SiGithub, label: "GitHub", note: "@Zariffdn" },
    ],
  },
  {
    key: "languages",
    items: [
      { Icon: SiFlutter, label: "Flutter", note: "Primary mobile framework" },
      { Icon: SiDart, label: "Dart", note: "Day-to-day language" },
      { Icon: SiJavascript, label: "JavaScript", note: "Web work & this portfolio" },
      { Icon: CgCPlusPlus, label: "C++", note: "Embedded / Arduino projects" },
      { Icon: SiPhp, label: "PHP", note: "Earlier web projects" },
      { Icon: SiPython, label: "Python", note: "Data science / scripting" },
      { Icon: FaJava, label: "Java", note: "University & Android basics" },
    ],
  },
  {
    key: "tools",
    items: [
      { Icon: SiPostman, label: "Postman", note: "API testing" },
      { Icon: SiFigma, label: "Figma", note: "UI mockups & handoff" },
      { Icon: SiNpm, label: "npm", note: "JS package manager" },
      { Icon: SiGradle, label: "Gradle", note: "Android builds" },
      { Icon: SiArduino, label: "Arduino IDE", note: "Microcontroller projects" },
    ],
  },
  {
    key: "system",
    items: [
      { Icon: FaWindows, label: "Windows 11", note: "Daily driver OS" },
      { Icon: FaTerminal, label: "PowerShell", note: "Default terminal" },
      { Icon: SiGooglechrome, label: "Chrome", note: "Primary browser" },
    ],
  },
  {
    key: "hardware",
    items: [
      {
        Icon: FaLaptopCode,
        label: "Lenovo IdeaPad 1 (15AMN7)",
        note: "Daily driver — Windows 11, 15.6\" display",
      },
      {
        Icon: FaMicrochip,
        label: "AMD Ryzen 5 7520U",
        note: "2.80 GHz with Radeon integrated graphics",
      },
      {
        Icon: FaMemory,
        label: "16 GB RAM",
        note: "Plenty of room for Android emulator + IDE",
      },
    ],
  },
];

function Uses() {
  const { t } = useTranslation();
  usePageMeta({
    title: "Uses — Zariff Danial",
    description:
      "The hardware, editor, languages, and tools Zariff Danial uses day-to-day for mobile development.",
  });

  return (
    <Container fluid className="about-section">
      <Particle />
      <Container>
        <FadeIn>
          <h1 className="project-heading" style={{ marginTop: "20px" }}>
            {t("uses.headingPre")}{" "}
            <strong className="purple">{t("uses.headingHighlight")}</strong>
          </h1>
          <p
            style={{
              textAlign: "center",
              opacity: 0.8,
              marginBottom: "30px",
            }}
          >
            {t("uses.subtitle")}
          </p>
        </FadeIn>

        {sections.map((section, i) => (
          <FadeIn key={section.key} delay={i * 0.05}>
            <section className="uses-section">
              <h2 className="uses-section-title">{t(`uses.${section.key}`)}</h2>
              <Row className="uses-grid">
                {section.items.map(({ Icon, label, note }) => (
                  <Col xs={12} sm={6} md={4} key={label} className="uses-item-col">
                    <article className="uses-item">
                      <div className="uses-item-icon" aria-hidden="true">
                        <Icon />
                      </div>
                      <div className="uses-item-text">
                        <div className="uses-item-label">{label}</div>
                        {note && <div className="uses-item-note">{note}</div>}
                      </div>
                    </article>
                  </Col>
                ))}
              </Row>
            </section>
          </FadeIn>
        ))}
      </Container>
    </Container>
  );
}

export default Uses;
