import React from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaQuoteLeft } from "react-icons/fa";
import FadeIn from "../FadeIn";

// To add a testimonial: append an object with name, role, company, quote, and
// optionally an avatar URL (a remote photo or imported image). Leave the array
// empty to hide the entire section.
//
// Tip: ask for LinkedIn recommendations from a peer, a manager, and a lecturer
// for the strongest spread.
const testimonials = [
  {
    id: "shazlin-zen",
    name: "Shazlin Nizam A.",
    role: "Mobile Developer",
    company: "Zen Computer Systems",
    quote:
      "Independent developer with the ability to learn something new.",
    // avatar: "https://media.licdn.com/...", // add Shazlin's LinkedIn photo URL if you want
  },
];

function initialOf(name) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

function Testimonials() {
  const { t } = useTranslation();

  if (testimonials.length === 0) return null;

  return (
    <>
      <FadeIn>
        <h1 className="project-heading">
          {t("about.testimonialsPre")}{" "}
          <strong className="purple">{t("about.testimonialsHighlight")}</strong>
        </h1>
      </FadeIn>
      <Row
        style={{ justifyContent: "center", paddingBottom: "30px" }}
        className="testimonials-row"
      >
        {testimonials.map((tst, i) => (
          <Col md={4} key={tst.id} className="testimonial-col">
            <FadeIn delay={i * 0.08}>
              <article className="testimonial-card">
                <FaQuoteLeft className="testimonial-quote-icon" aria-hidden="true" />
                <p className="testimonial-quote">{tst.quote}</p>
                <div className="testimonial-author">
                  {tst.avatar ? (
                    <img
                      src={tst.avatar}
                      alt={tst.name}
                      className="testimonial-avatar"
                      loading="lazy"
                    />
                  ) : (
                    <span className="testimonial-avatar testimonial-avatar-placeholder">
                      {initialOf(tst.name)}
                    </span>
                  )}
                  <div className="testimonial-meta">
                    <div className="testimonial-name">{tst.name}</div>
                    <div className="testimonial-role">
                      {tst.role}
                      {tst.company ? ` · ${tst.company}` : ""}
                    </div>
                  </div>
                </div>
              </article>
            </FadeIn>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default Testimonials;
