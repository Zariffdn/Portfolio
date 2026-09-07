import React from "react";
import { useTranslation } from "react-i18next";
import { FiArrowUpRight } from "react-icons/fi";
import { Container, Section, SectionHeading, Stagger, StaggerItem } from "../ui";
import { formatMonth } from "../../utils/formatMonth";
import "../../styles/about-sections.css";

// To add a cert: append an object with title, issuer, date (ISO "YYYY-MM",
// rendered in the active language), and optional credentialUrl +
// credentialId fields. Leave the array empty to hide the
// entire section.
const certifications = [
  {
    id: "ibm-flutter-spec",
    title: "Developing Mobile Apps with Flutter Specialization",
    issuer: "IBM",
    date: "2025-07",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/specialization/UL4M9RW95NWE",
    credentialId: "UL4M9RW95NWE",
  },
  {
    id: "ibm-flutter-dart",
    title: "Flutter and Dart: Developing iOS, Android, and Mobile Apps",
    issuer: "IBM",
    date: "2025-07",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/RQW9W999M8OT",
    credentialId: "RQW9W999M8OT",
  },
  {
    id: "comptia-tech-plus",
    title: "CompTIA Tech+ Certification",
    issuer: "CompTIA",
    date: "2025-10",
    credentialUrl:
      "https://www.credly.com/badges/63fedd61-90a9-4869-bb9d-a5725016c123",
  },
  {
    id: "meta-frontend-spec",
    title: "Meta Front-End Developer Specialization",
    issuer: "Meta",
    date: "2025-10",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/professional-cert/GBO8HRSDL0IJ",
    credentialId: "GBO8HRSDL0IJ",
  },
  {
    id: "meta-advanced-react",
    title: "Advanced React",
    issuer: "Meta",
    date: "2025-10",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/CUDTV61VL1BZ",
    credentialId: "CUDTV61VL1BZ",
  },
  {
    id: "meta-ux-ui",
    title: "Principles of UX/UI Design",
    issuer: "Meta",
    date: "2025-10",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/OR4OXFF5AVWR",
    credentialId: "OR4OXFF5AVWR",
  },
];

function Certifications() {
  const { t, i18n } = useTranslation();

  if (certifications.length === 0) return null;

  return (
    <Section hairline>
      <Container>
        <SectionHeading
          title={t("about.myCertsPre") + " " + t("about.myCertsHighlight")}
        />
        <Stagger as="ul" role="list" className="certs">
          {certifications.map((c) => (
            <StaggerItem as="li" className="certs__row" key={c.id}>
              <div>
                <h3 className="certs__title">{c.title}</h3>
                {c.credentialId && (
                  <p className="certs__id mono text-3 small">
                    {t("about.credentialId") + " " + c.credentialId}
                  </p>
                )}
              </div>
              <div>
                <p className="certs__issuer">{c.issuer}</p>
                <p className="certs__date text-3 small">
                  <time dateTime={c.date}>
                    {formatMonth(c.date, i18n.resolvedLanguage)}
                  </time>
                </p>
              </div>
              {c.credentialUrl && (
                <a
                  href={c.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-arrow certs__link"
                >
                  {t("about.viewCredential")}
                  <FiArrowUpRight aria-hidden="true" />
                </a>
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export default Certifications;
