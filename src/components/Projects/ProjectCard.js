import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiGithub } from "react-icons/fi";
import Chip from "../ui/Chip";
import PhoneFrame from "../ui/PhoneFrame";
import Button from "../ui/Button";
import "../../styles/project-card.css";

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// One project, from src/data/projects.js.
// variant: "default" | "wide" (media beside body; use for the featured entry)
// clamp:   number of description lines to show, 0 shows everything
function ProjectCard({ project, variant = "default", clamp = 0, priority = false }) {
  const { t } = useTranslation();
  const {
    id,
    category,
    img,
    imgKind,
    imgFit = "cover",
    tags = [],
    ghLink,
    caseStudy,
    personal,
    proprietary,
    production,
  } = project;

  const title = t(`projects.${id}_title`);
  const desc = t(`projects.${id}_desc`);
  const wide = variant === "wide";

  let badge = null;
  if (production) badge = <Chip tone="accent">{t("projects.productionBadge")}</Chip>;
  else if (personal) badge = <Chip>{t("projects.personalBadge")}</Chip>;
  else if (proprietary) badge = <Chip>{t("projects.proprietaryBadge")}</Chip>;

  const media =
    imgKind === "phone" ? (
      <div className="pcard__media pcard__media--phone">
        <PhoneFrame src={img} alt="" size="sm" priority={priority} />
      </div>
    ) : (
      <div className={`pcard__media pcard__media--${imgFit}`}>
        <img src={img} alt="" loading={priority ? "eager" : "lazy"} decoding="async" />
      </div>
    );

  let titleNode = title;
  if (caseStudy) titleNode = <Link to={caseStudy}>{title}</Link>;
  else if (ghLink) {
    titleNode = (
      <a href={ghLink} target="_blank" rel="noopener noreferrer">
        {title}
      </a>
    );
  }

  let cta;
  if (caseStudy) {
    cta = wide ? (
      <Button to={caseStudy} variant="soft" size="sm" icon={<FiArrowRight />} iconArrow>
        {t("projects.featuredCta")}
      </Button>
    ) : (
      <Link to={caseStudy} className="link-arrow">
        {t("projects.featuredCta")} <FiArrowRight aria-hidden="true" />
      </Link>
    );
  } else if (ghLink) {
    cta = (
      <a href={ghLink} target="_blank" rel="noopener noreferrer" className="link-arrow">
        <FiGithub aria-hidden="true" /> {t("projects.viewCode")}
      </a>
    );
  } else {
    cta = <span className="pcard__norepo mono small text-3">{t("projects.noRepo")}</span>;
  }

  return (
    <article className={`pcard surface surface--interactive ${wide ? "pcard--wide" : ""}`.trim()}>
      {media}
      <div className="pcard__body">
        <div className="pcard__top">
          {badge}
          <span className="pcard__category mono">{t(`projects.filter${cap(category)}`)}</span>
        </div>
        <h3 className="pcard__title">{titleNode}</h3>
        <p
          className={`pcard__desc ${clamp ? "pcard__desc--clamp" : ""}`.trim()}
          style={clamp ? { WebkitLineClamp: clamp } : undefined}
        >
          {desc}
        </p>
        {tags.length > 0 && (
          <div className="chip-row pcard__tags">
            {tags.map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
        )}
        <div className="pcard__footer">{cta}</div>
      </div>
    </article>
  );
}

export default ProjectCard;
