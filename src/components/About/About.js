import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import Github from "./Github";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import laptopImg from "../../Assets/about.png";
import Toolstack from "./Toolstack";
import Experience from "./Experience";
import Education from "./Education";
import Certifications from "./Certifications";
import StatsCounter from "./StatsCounter";
import FeaturedWork from "./FeaturedWork";
import usePageMeta from "../../hooks/usePageMeta";
import { useTranslation } from "react-i18next";
import FadeIn from "../FadeIn";

function About() {
  const { t } = useTranslation();
  usePageMeta({
    title: "About — Zariff Danial",
    description:
      "Mobile Developer at Zen Computer Systems. Flutter and Dart, currently working on MyTax mobile app under LHDN.",
  });

  return (
    <Container fluid className="about-section">
      <Particle />
      <Container>
        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col
            md={7}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "50px",
            }}
          >
            <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
              {t("about.knowMePre")}{" "}
              <strong className="purple">{t("about.knowMeHighlight")}</strong>
            </h1>
            <Aboutcard />
          </Col>
          <Col
            md={5}
            style={{ paddingTop: "120px", paddingBottom: "50px" }}
            className="about-img"
          >
            <img src={laptopImg} alt="about" className="img-fluid" />
          </Col>
        </Row>

        <FeaturedWork />

        <FadeIn>
          <h1 className="project-heading">
            {t("about.byTheNumbersPre")}{" "}
            <strong className="purple">{t("about.byTheNumbersHighlight")}</strong>
          </h1>
        </FadeIn>
        <StatsCounter />

        <FadeIn>
          <h1 className="project-heading">
            {t("about.myExperiencePre")}{" "}
            <strong className="purple">{t("about.myExperienceHighlight")}</strong>
          </h1>
          <Experience />
        </FadeIn>

        <FadeIn>
          <h1 className="project-heading">
            {t("about.myEducationPre")}{" "}
            <strong className="purple">{t("about.myEducationHighlight")}</strong>
          </h1>
          <Education />
        </FadeIn>

        <Certifications />

        <FadeIn>
          <h1 className="project-heading">
            {t("about.skillsetPre")}{" "}
            <strong className="purple">{t("about.skillsetHighlight")} </strong>
          </h1>
          <Techstack />
        </FadeIn>

        <FadeIn>
          <h1 className="project-heading">
            <strong className="purple">{t("about.toolsHighlight")}</strong>{" "}
            {t("about.toolsPost")}
          </h1>
          <Toolstack />
        </FadeIn>

        <FadeIn>
          <Github />
        </FadeIn>
      </Container>
    </Container>
  );
}

export default About;
