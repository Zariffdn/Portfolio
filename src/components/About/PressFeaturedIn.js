import React from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineExternalLink } from "react-icons/hi";
import { FaNewspaper } from "react-icons/fa";
import FadeIn from "../FadeIn";

// To add a press mention: append an object with publication, title, url and
// (optionally) a date. Leave the array empty to hide the entire section.
//
// Tip: use ChatGPT with web search to find mentions of MyTax in The Star,
// NST, Malaysiakini, BERNAMA, Astro Awani, etc.
const press = [
  // Example shape — uncomment and edit when ready:
  // {
  //   id: "the-star-2024",
  //   publication: "The Star",
  //   title: "LHDN launches MyTax mobile app for easier filing",
  //   url: "https://www.thestar.com.my/...",
  //   date: "March 2024",
  // },
];

function PressFeaturedIn() {
  const { t } = useTranslation();

  if (press.length === 0) return null;

  return (
    <>
      <FadeIn>
        <h1 className="project-heading">
          {t("about.pressPre")}{" "}
          <strong className="purple">{t("about.pressHighlight")}</strong>
        </h1>
      </FadeIn>
      <FadeIn>
        <div className="press-strip">
          {press.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="press-chip"
              aria-label={`${p.publication}: ${p.title}`}
            >
              <span className="press-chip-icon" aria-hidden="true">
                <FaNewspaper />
              </span>
              <span className="press-chip-text">
                <span className="press-chip-publication">{p.publication}</span>
                <span className="press-chip-title">{p.title}</span>
                {p.date && <span className="press-chip-date">{p.date}</span>}
              </span>
              <HiOutlineExternalLink
                className="press-chip-external"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      </FadeIn>
    </>
  );
}

export default PressFeaturedIn;
