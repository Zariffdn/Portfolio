import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import bag from "../../Assets/Projects/bag.png";
import movie from "../../Assets/Projects/movie.png";
import bookstore from "../../Assets/Projects/bookstore.png";
import usePageMeta from "../../hooks/usePageMeta";
import { useTranslation } from "react-i18next";
import FadeIn from "../FadeIn";

function Projects() {
  const { t } = useTranslation();
  usePageMeta({
    title: "Projects — Zariff Danial",
    description:
      "A selection of projects by Zariff Danial — embedded systems, web applications, and mobile work.",
  });

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          {t("projects.headingPre")}{" "}
          <strong className="purple">{t("projects.headingHighlight")} </strong>
        </h1>
        <p style={{ color: "var(--text-primary)" }}>{t("projects.intro")}</p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <FadeIn>
              <ProjectCard
                imgPath={bag}
                isBlog={false}
                title={t("projects.baglock_title")}
                description={t("projects.baglock_desc")}
                ghLink="https://github.com/zazarip/Anti-theft-fingerprint-baglock"
                tags={["C++", "Arduino", "Fingerprint Sensor", "GPS", "GSM"]}
              />
            </FadeIn>
          </Col>

          <Col md={4} className="project-card">
            <FadeIn delay={0.1}>
              <ProjectCard
                imgPath={movie}
                isBlog={false}
                title={t("projects.movie_title")}
                description={t("projects.movie_desc")}
                ghLink="https://github.com/zazarip/movie-ticket"
                tags={["JavaScript", "PHP", "CSS", "MySQL"]}
              />
            </FadeIn>
          </Col>
          <Col md={4} className="project-card">
            <FadeIn delay={0.2}>
              <ProjectCard
                imgPath={bookstore}
                isBlog={false}
                title={t("projects.bookstore_title")}
                description={t("projects.bookstore_desc")}
                ghLink="https://github.com/zazarip/Bookstore"
                tags={["PHP", "HTML", "MySQL"]}
              />
            </FadeIn>
          </Col>





        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
