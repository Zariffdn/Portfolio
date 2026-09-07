import "../../styles/projects.css";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Section, SectionHeading, Stagger, StaggerItem } from "../ui";
import ProjectCard from "./ProjectCard";
import { projects, filters } from "../../data/projects";
import usePageMeta from "../../hooks/usePageMeta";

const EASE = [0.22, 1, 0.36, 1];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Number of projects behind each filter; "all" is the full list.
const counts = filters.reduce((acc, f) => {
  acc[f] = f === "all" ? projects.length : projects.filter((p) => p.category === f).length;
  return acc;
}, {});

const swap = { opacity: 0, y: 8 };
const swapTransition = { duration: 0.25, ease: EASE };

// One grid cell. Cards present at the first reveal are staggered in by the
// parent <Stagger>. A card mounted later (after a filter change) sits inside
// a parent whose in-view state has already fired, so it runs its own short
// entrance instead. `late` is captured once at mount so it never flips.
function GridItem({ project, late, priority }) {
  const wide = Boolean(project.featured);
  const lateRef = useRef(late);
  const entrance = lateRef.current
    ? { initial: swap, animate: { opacity: 1, y: 0 } }
    : {};

  return (
    <StaggerItem
      layout="position"
      className={`projects-grid__item ${wide ? "projects-grid__item--wide" : ""}`.trim()}
      exit={swap}
      transition={swapTransition}
      {...entrance}
    >
      <ProjectCard
        project={project}
        variant={wide ? "wide" : "default"}
        clamp={0}
        priority={priority}
      />
    </StaggerItem>
  );
}

function Projects() {
  const { t } = useTranslation();
  const [active, setActive] = useState("all");
  const revealedRef = useRef(false);
  const tabRefs = useRef({});

  usePageMeta({
    title: t("meta.projects"),
    description: t("meta.projectsDesc"),
  });

  const filtered =
    active === "all" ? projects : projects.filter((p) => p.category === active);

  // Roving tabindex: arrows, Home and End move between tabs and select.
  const onTabKeyDown = (e) => {
    const i = filters.indexOf(active);
    let next = null;
    if (e.key === "ArrowRight") next = (i + 1) % filters.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + filters.length) % filters.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = filters.length - 1;
    if (next === null) return;
    e.preventDefault();
    const id = filters[next];
    setActive(id);
    const el = tabRefs.current[id];
    if (el) el.focus();
  };

  return (
    <Section className="projects-section" aria-labelledby="projects-title">
      <Container>
        <SectionHeading
          as="h1"
          id="projects-title"
          eyebrow={t("projects.eyebrow")}
          title={t("home.workTitle")}
          lead={t("projects.intro")}
        />

        <motion.div className="projects-filters" layoutScroll>
          <div
            className="projects-filters__list"
            role="tablist"
            aria-label={t("projects.eyebrow")}
            onKeyDown={onTabKeyDown}
          >
            {filters.map((f) => {
              const isActive = f === active;
              const label = t(`projects.filter${cap(f)}`);
              return (
                <button
                  key={f}
                  ref={(el) => {
                    tabRefs.current[f] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`projects-tab-${f}`}
                  aria-selected={isActive}
                  aria-controls="projects-panel"
                  tabIndex={isActive ? 0 : -1}
                  aria-label={`${label} (${counts[f]})`}
                  className="projects-filter"
                  onClick={() => setActive(f)}
                >
                  {isActive && (
                    <motion.span
                      layoutId="projects-filter-pill"
                      className="projects-filter__pill"
                      aria-hidden="true"
                      transition={{ type: "tween", duration: 0.3, ease: EASE }}
                    />
                  )}
                  <span className="projects-filter__label">{label}</span>
                  <span className="projects-filter__count">{counts[f]}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <div
          id="projects-panel"
          role="tabpanel"
          aria-labelledby={`projects-tab-${active}`}
        >
          {/* Names the active filter so the outline reads h1 > h2 > h3 cards. */}
          <h2 className="sr-only">{t(`projects.filter${cap(active)}`)}</h2>
          {filtered.length === 0 ? (
            <div className="surface projects-empty">
              <h2 className="h3">{t("projects.emptyTitle")}</h2>
              <p>{t("projects.emptyDesc")}</p>
            </div>
          ) : (
            <Stagger
              className="projects-grid"
              onViewportEnter={() => {
                revealedRef.current = true;
              }}
            >
              {/* `mode` is ignored by the installed framer-motion 6.5.1 and
                  takes effect once the dependency is on 7 or later. */}
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <GridItem
                    key={p.id}
                    project={p}
                    late={revealedRef.current}
                    priority={i === 0}
                  />
                ))}
              </AnimatePresence>
            </Stagger>
          )}
        </div>
      </Container>
    </Section>
  );
}

export default Projects;
