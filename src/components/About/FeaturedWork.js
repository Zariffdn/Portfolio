import React from "react";
import { useTranslation } from "react-i18next";
import { FiArrowRight } from "react-icons/fi";
import { Container, Section, Button, Reveal, PhoneFrame } from "../ui";
import StoreLinks from "../StoreLinks";
import { screenshots } from "../../data/mytax";

const STATS = [1, 2, 3];

// The MyTax panel: label, title, three stats, store links, case study CTA,
// and three real screenshots in small phone frames.
function FeaturedWork() {
  const { t } = useTranslation();

  return (
    <Section hairline id="featured">
      <Container>
        <Reveal>
          <article className="surface fw-panel">
            <div className="fw-grid">
              <div className="fw-text">
                <span className="eyebrow">{t("about.featuredLabel")}</span>
                <h2>{t("about.featuredTitle")}</h2>
                <p className="lead fw-sub">{t("about.featuredSubtitle")}</p>
                <p className="text-2 fw-desc">{t("about.featuredDescription")}</p>

                <div className="fw-stats">
                  {STATS.map((n) => (
                    <div className="fw-stat" key={n}>
                      <span className="fw-stat__value">
                        {t(`about.featuredStat${n}Value`)}
                      </span>
                      <span className="eyebrow eyebrow--plain fw-stat__label">
                        {t(`about.featuredStat${n}Label`)}
                      </span>
                    </div>
                  ))}
                </div>

              </div>

              <div className="fw-visual">
                {screenshots.map((src, i) => (
                  <PhoneFrame
                    key={src}
                    src={src}
                    size="sm"
                    alt={`${t("home.phoneAlt")} ${i + 1}`}
                  />
                ))}
              </div>

              <div className="fw-footer">
                <StoreLinks />
                <Button
                  to="/mytax"
                  variant="primary"
                  icon={<FiArrowRight />}
                  iconArrow
                >
                  {t("about.readCaseStudy")}
                </Button>
              </div>
            </div>
          </article>
        </Reveal>
      </Container>
    </Section>
  );
}

export default FeaturedWork;
