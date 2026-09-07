import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Section, SectionHeading, StaggerItem } from "../ui";
import StatTile, { StatGrid } from "../StatTile";
import { stats } from "../../data/stats";
import useInViewOnce from "../../hooks/useInViewOnce";

// Four headline numbers that count up the first time they scroll into view.
// Same tiles as the Home about teaser (components/StatTile.js).
function StatsCounter() {
  const { t } = useTranslation();
  const [statsRef, statsSeen] = useInViewOnce(0.3);

  return (
    <Section tight id="numbers">
      <Container>
        <SectionHeading
          title={`${t("about.byTheNumbersPre")} ${t("about.byTheNumbersHighlight")}`}
        />
        <div ref={statsRef}>
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
  );
}

export default StatsCounter;
