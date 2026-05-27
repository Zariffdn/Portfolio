import React from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaRegQuestionCircle } from "react-icons/fa";
import FadeIn from "../FadeIn";

const faqs = [
  { id: "remote" },
  { id: "visa" },
  { id: "notice" },
  { id: "salary" },
  { id: "tech" },
];

function FAQ() {
  const { t } = useTranslation();

  return (
    <>
      <FadeIn>
        <h1 className="project-heading">
          {t("faq.headingPre")}{" "}
          <strong className="purple">{t("faq.headingHighlight")}</strong>
        </h1>
        <p
          style={{
            textAlign: "center",
            opacity: 0.8,
            marginBottom: "30px",
          }}
        >
          {t("faq.subtitle")}
        </p>
      </FadeIn>
      <Row
        style={{ justifyContent: "center", paddingBottom: "30px" }}
        className="faq-row"
      >
        {faqs.map((faq, i) => (
          <Col md={6} key={faq.id} className="faq-col">
            <FadeIn delay={i * 0.06}>
              <article className="faq-card">
                <div className="faq-icon" aria-hidden="true">
                  <FaRegQuestionCircle />
                </div>
                <h3 className="faq-question">{t(`faq.${faq.id}.q`)}</h3>
                <p className="faq-answer">{t(`faq.${faq.id}.a`)}</p>
              </article>
            </FadeIn>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default FAQ;
