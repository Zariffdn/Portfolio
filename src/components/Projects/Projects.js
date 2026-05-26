import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import bag from "../../Assets/Projects/bag.png";
import movie from "../../Assets/Projects/movie.png";
import bookstore from "../../Assets/Projects/bookstore.png";
import usePageMeta from "../../hooks/usePageMeta";
import { useTranslation } from "react-i18next";
import FadeIn from "../FadeIn";

const projects = [
  {
    id: "baglock",
    category: "embedded",
    img: bag,
    tags: ["C++", "Arduino", "Fingerprint Sensor", "GPS", "GSM"],
    ghLink: "https://github.com/zazarip/Anti-theft-fingerprint-baglock",
  },
  {
    id: "movie",
    category: "web",
    img: movie,
    tags: ["JavaScript", "PHP", "CSS", "MySQL"],
    ghLink: "https://github.com/zazarip/movie-ticket",
  },
  {
    id: "bookstore",
    category: "web",
    img: bookstore,
    tags: ["PHP", "HTML", "MySQL"],
    ghLink: "https://github.com/zazarip/Bookstore",
  },
];

const filters = ["all", "web", "mobile", "embedded"];

function Projects() {
  const { t } = useTranslation();
  const [active, setActive] = useState("all");
  usePageMeta({
    title: "Projects — Zariff Danial",
    description:
      "A selection of projects by Zariff Danial — embedded systems, web applications, and mobile work.",
  });

  const filtered =
    active === "all" ? projects : projects.filter((p) => p.category === active);

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          {t("projects.headingPre")}{" "}
          <strong className="purple">{t("projects.headingHighlight")} </strong>
        </h1>
        <p style={{ color: "var(--text-primary)" }}>{t("projects.intro")}</p>

        <div className="project-filters" role="tablist">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={active === f}
              onClick={() => setActive(f)}
              className={`project-filter-btn ${active === f ? "is-active" : ""}`}
            >
              {t(`projects.filter${f.charAt(0).toUpperCase() + f.slice(1)}`)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <FadeIn>
            <div className="projects-empty">
              <span className="projects-empty-icon" aria-hidden="true">🛠️</span>
              <h3>{t("projects.emptyTitle")}</h3>
              <p>{t("projects.emptyDesc")}</p>
            </div>
          </FadeIn>
        ) : (
          <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
            {filtered.map((p, i) => (
              <Col md={4} className="project-card" key={p.id}>
                <FadeIn delay={i * 0.1}>
                  <ProjectCard
                    imgPath={p.img}
                    isBlog={false}
                    title={t(`projects.${p.id}_title`)}
                    description={t(`projects.${p.id}_desc`)}
                    ghLink={p.ghLink}
                    tags={p.tags}
                  />
                </FadeIn>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </Container>
  );
}

export default Projects;
