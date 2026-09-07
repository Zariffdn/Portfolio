import React from "react";
import { useTranslation } from "react-i18next";
import { FiArrowUpRight } from "react-icons/fi";
import { Container, Section, SectionHeading, Stagger, StaggerItem } from "../ui";
import { press } from "../../data/mytax";
import { formatMonth } from "../../utils/formatMonth";

// One full-width row per press mention. The list lives in data/mytax.js;
// an empty list hides the section. The heading shows the article's original
// Malay title when the site is in Bahasa Malaysia and the English gloss
// otherwise; the other language drops to the secondary line.
function PressFeaturedIn() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const isMs = lang === "ms";

  if (press.length === 0) return null;

  return (
    <Section tight id="press">
      <Container>
        <SectionHeading
          title={`${t("about.pressPre")} ${t("about.pressHighlight")}`}
        />
        <Stagger className="press-list">
          {press.map((p) => {
            const english = { text: p.title, lang: "en" };
            const original = p.titleOriginal
              ? { text: p.titleOriginal, lang: "ms" }
              : null;
            const heading = isMs && original ? original : english;
            const secondary = original ? (isMs ? english : original) : null;
            const date = p.date ? formatMonth(p.date, lang) : "";

            return (
              <StaggerItem key={p.id}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface surface--interactive press-row"
                  aria-label={`${p.publication}: ${heading.text}`}
                >
                  <div className="press-row__body">
                    <span className="eyebrow eyebrow--plain press-row__meta">
                      {/* One child so the eyebrow flex gap never splits the line */}
                      <span>
                        {p.publication}
                        {date ? (
                          <>
                            {" · "}
                            <time dateTime={p.date}>{date}</time>
                          </>
                        ) : null}
                      </span>
                    </span>
                    <h3 lang={heading.lang}>{heading.text}</h3>
                    {secondary && (
                      <p
                        className="text-3 small press-row__orig"
                        lang={secondary.lang}
                      >
                        {secondary.text}
                      </p>
                    )}
                  </div>
                  <FiArrowUpRight
                    className="press-row__icon"
                    aria-hidden="true"
                  />
                </a>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </Section>
  );
}

export default PressFeaturedIn;
