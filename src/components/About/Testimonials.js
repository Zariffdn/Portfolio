import React from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaQuoteLeft, FaLinkedin } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";
import FadeIn from "../FadeIn";
import nizamPhoto from "../../Assets/nizam.jpg";

// To add a testimonial: append an object with name, role, company, quote, and
// optionally an avatar (a local imported image — preferred — or a remote URL).
// Leave the array empty to hide the entire section.
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
    avatar: nizamPhoto,
  },
];

// Full LinkedIn recommendations list — shown as a single "see all" link
// beneath the testimonial grid for visitors who want to verify.
const RECOMMENDATIONS_URL =
  "https://www.linkedin.com/in/zariffdanial/details/recommendations/";

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
        style={{ justifyContent: "center", paddingBottom: "10px" }}
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
      <FadeIn delay={0.15}>
        <div className="testimonials-see-all">
          <a
            href={RECOMMENDATIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="testimonials-see-all-link"
          >
            <FaLinkedin aria-hidden="true" />
            <span>{t("about.seeAllRecommendations")}</span>
            <HiOutlineExternalLink aria-hidden="true" />
          </a>
        </div>
      </FadeIn>
    </>
  );
}

export default Testimonials;
