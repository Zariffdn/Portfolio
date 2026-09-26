import { useTranslation } from "react-i18next";
import { FiArrowUpRight } from "react-icons/fi";
import { Container, Section, SectionHeading, Stagger, StaggerItem } from "../ui";
import { press } from "../../data/mytax";
import { formatMonth } from "../../utils/formatMonth";

// One full-width row per press mention. The list lives in data/mytax.js;
// an empty list hides the section. Each row quotes the sentence that names the
// app. In Bahasa Malaysia a row uses the article's Malay title, link and quote
// when it has them. A Malay article with only an English gloss (titleOriginal
// but no urlOriginal) keeps the other-language title on a secondary line.
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
          lead={t("about.pressLead")}
        />
        <Stagger className="press-list">
          {press.map((p) => {
            const english = { text: p.title, lang: "en" };
            const original = p.titleOriginal
              ? { text: p.titleOriginal, lang: "ms" }
              : null;
            const useMs = isMs && original;
            const heading = useMs ? original : english;
            const secondary =
              original && !p.urlOriginal ? (isMs ? english : original) : null;
            const url = useMs && p.urlOriginal ? p.urlOriginal : p.url;
            // Quotes stay in the language they were published in.
            let quote = null;
            if (useMs && p.quoteOriginal) quote = { text: p.quoteOriginal, lang: "ms" };
            else if (p.quote) quote = { text: p.quote, lang: "en" };
            else if (p.quoteOriginal) quote = { text: p.quoteOriginal, lang: "ms" };
            const date = p.date ? formatMonth(p.date, lang) : "";

            return (
              <StaggerItem key={p.id}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="surface surface--interactive press-row"
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
                    {quote && (
                      <p
                        className="text-2 small press-row__quote"
                        lang={quote.lang}
                      >
                        “{quote.text}”
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
