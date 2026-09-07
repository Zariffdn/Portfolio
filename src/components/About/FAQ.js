import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Section, SectionHeading, Stagger, StaggerItem } from "../ui";
import "../../styles/about-sections.css";

// Each id maps to faq.<id>.q and faq.<id>.a in the locale files.
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
    <Section hairline>
      <Container>
        <SectionHeading
          title={t("faq.headingPre") + " " + t("faq.headingHighlight")}
          lead={t("faq.subtitle")}
        />
        <Stagger as="ul" role="list" className="faq">
          {faqs.map((faq) => (
            <StaggerItem as="li" className="faq__row" key={faq.id}>
              <h3 className="faq__q">{t(`faq.${faq.id}.q`)}</h3>
              <p className="faq__a text-2">{t(`faq.${faq.id}.a`)}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export default FAQ;
