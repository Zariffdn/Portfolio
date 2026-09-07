import React from "react";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useTranslation } from "react-i18next";
import { FiArrowRight } from "react-icons/fi";
import {
  Container,
  Section,
  SectionHeading,
  Button,
  Reveal,
  Stagger,
  StaggerItem,
  PhoneFrame,
} from "../ui";
import ProjectCard from "../Projects/ProjectCard";
import AvailableForHire from "../AvailableForHire";
import StatTile, { StatGrid } from "../StatTile";
import usePageMeta from "../../hooks/usePageMeta";
import useInViewOnce from "../../hooks/useInViewOnce";
import { screenshots } from "../../data/mytax";
import { selectedForHome, byId } from "../../data/projects";
import { stats } from "../../data/stats";
import "../../styles/home.css";

const EASE = [0.22, 1, 0.36, 1];

// Locale key pairs for the proof strip under the hero copy.
const PROOF = [
  ["proofInstallsValue", "proofInstallsLabel"],
  ["proofStoresValue", "proofStoresLabel"],
  ["proofPressValue", "proofPressLabel"],
  ["proofSinceValue", "proofSinceLabel"],
];

// One hero headline line. The outer span clips; the inner slides up into it.
function HeroLine({ children, index, accent = false }) {
  return (
    <span className={`home-hero__line${accent ? " home-hero__line--accent" : ""}`}>
      <motion.span
        className="home-hero__line-inner"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay: index * 0.09, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Home() {
  const { t } = useTranslation();
  const [statsRef, statsSeen] = useInViewOnce(0.3);

  usePageMeta({
    title: t("meta.home"),
    description: t("meta.homeDesc"),
  });

  const work = selectedForHome.map(byId).filter(Boolean);

  return (
    <div className="home">
      {/* 1. Hero */}
      <Section className="home-hero" aria-labelledby="home-hero-title">
        <Container>
          <div className="home-hero__grid">
            <div className="home-hero__text">
              <AvailableForHire />

              <h1 id="home-hero-title" className="display home-hero__title">
                <HeroLine index={0}>{t("home.heroLine1")}</HeroLine>
                <HeroLine index={1} accent>
                  {t("home.heroLine2")}
                </HeroLine>
              </h1>

              <Reveal delay={0.12}>
                <p className="lead home-hero__lead">{t("home.heroLead")}</p>
                <div className="home-hero__cta">
                  <Button
                    to="/project"
                    variant="primary"
                    icon={<FiArrowRight />}
                    iconArrow
                  >
                    {t("home.ctaWork")}
                  </Button>
                  <Button to="/about#contact" variant="ghost">
                    {t("home.ctaContact")}
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={0.5}>
                <ul className="home-proof">
                  {PROOF.map(([valueKey, labelKey]) => (
                    <li className="home-proof__item" key={valueKey}>
                      <span className="home-proof__value">{t(`home.${valueKey}`)}</span>
                      <span className="eyebrow eyebrow--plain">{t(`home.${labelKey}`)}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <motion.div
              className="home-hero__visual"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            >
              <div className="home-hero__glow" aria-hidden="true" />
              <div className="home-hero__stack">
                <div className="home-hero__side home-hero__side--left" aria-hidden="true">
                  <PhoneFrame src={screenshots[0]} alt="" size="sm" />
                </div>
                <Tilt
                  className="home-hero__main"
                  tiltMaxAngleX={6}
                  tiltMaxAngleY={6}
                  glareEnable={false}
                  transitionSpeed={1800}
                >
                  <PhoneFrame src={screenshots[1]} priority alt={t("home.phoneAlt")} />
                </Tilt>
                <div className="home-hero__side home-hero__side--right" aria-hidden="true">
                  <PhoneFrame src={screenshots[2]} alt="" size="sm" />
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* 2. Selected work */}
      <Section hairline aria-labelledby="home-work-title">
        <Container>
          <SectionHeading
            id="home-work-title"
            eyebrow={t("home.workEyebrow")}
            title={t("home.workTitle")}
            lead={t("home.workLead")}
            aside={
              <Button
                to="/project"
                variant="ghost"
                size="sm"
                icon={<FiArrowRight />}
                iconArrow
              >
                {t("home.workAll")}
              </Button>
            }
          />
          <Stagger className="home-work__grid">
            {work.map((project, index) => {
              const wide = index === 0;
              return (
                <StaggerItem
                  key={project.id}
                  className={`home-work__item${wide ? " home-work__item--wide" : ""}`}
                >
                  <ProjectCard
                    project={project}
                    variant={wide ? "wide" : "default"}
                    clamp={wide ? 0 : 3}
                    priority={wide}
                  />
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>

      {/* 3. About teaser */}
      <Section tone="alt" hairline aria-labelledby="home-about-title">
        <Container>
          <Reveal>
            <div className="home-about__grid">
              <div className="home-about__head">
                <span className="eyebrow">{t("home.aboutEyebrow")}</span>
                <h2 id="home-about-title">{t("home.aboutTitle")}</h2>
              </div>
              <div className="home-about__body">
                <div className="prose">
                  <p>{t("home.aboutBody")}</p>
                </div>
                <Button
                  to="/about"
                  variant="soft"
                  icon={<FiArrowRight />}
                  iconArrow
                  className="home-about__more"
                >
                  {t("home.aboutMore")}
                </Button>
              </div>
            </div>
          </Reveal>

          <div ref={statsRef} className="home-about__stats">
            <StatGrid>
              {stats.map((stat) => (
                <StaggerItem as="li" key={stat.label}>
                  <StatTile
                    value={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                    started={statsSeen}
                  />
                </StaggerItem>
              ))}
            </StatGrid>
          </div>
        </Container>
      </Section>

      {/* 4. CTA band */}
      <Section aria-labelledby="home-cta-title">
        <Container>
          <Reveal>
            <div className="surface home-cta">
              <span className="eyebrow eyebrow--plain">{t("home.ctaEyebrow")}</span>
              <h2 id="home-cta-title">{t("home.ctaTitle")}</h2>
              <p className="lead">{t("home.ctaBody")}</p>
              <div className="home-cta__actions">
                <Button to="/about#contact" variant="accent" size="lg">
                  {t("home.ctaButton")}
                </Button>
              </div>
              <a
                href="mailto:zariffdanial.zul@gmail.com"
                className="home-cta__email mono small text-3"
              >
                {t("home.ctaEmail")}
              </a>
            </div>
          </Reveal>
        </Container>
      </Section>
    </div>
  );
}

export default Home;
