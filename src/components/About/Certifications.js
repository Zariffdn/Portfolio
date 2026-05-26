import React from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { HiOutlineExternalLink } from "react-icons/hi";
import { FaCertificate } from "react-icons/fa";
import FadeIn from "../FadeIn";

// To add a cert: append an object with title, issuer, date, and optional
// credentialUrl + credentialId fields. Leave the array empty to hide the
// entire section.
const certifications = [
  {
    id: "ibm-flutter-spec",
    title: "Developing Mobile Apps with Flutter Specialization",
    issuer: "IBM",
    date: "July 2025",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/specialization/UL4M9RW95NWE",
    credentialId: "UL4M9RW95NWE",
  },
  {
    id: "ibm-flutter-dart",
    title: "Flutter and Dart: Developing iOS, Android, and Mobile Apps",
    issuer: "IBM",
    date: "July 2025",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/RQW9W999M8OT",
    credentialId: "RQW9W999M8OT",
  },
  {
    id: "comptia-tech-plus",
    title: "CompTIA Tech+ Certification",
    issuer: "CompTIA",
    date: "October 2025",
    credentialUrl:
      "https://www.credly.com/badges/63fedd61-90a9-4869-bb9d-a5725016c123",
  },
  {
    id: "meta-frontend-spec",
    title: "Meta Front-End Developer Specialization",
    issuer: "Meta",
    date: "October 2025",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/professional-cert/GBO8HRSDL0IJ",
    credentialId: "GBO8HRSDL0IJ",
  },
  {
    id: "meta-advanced-react",
    title: "Advanced React",
    issuer: "Meta",
    date: "October 2025",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/CUDTV61VL1BZ",
    credentialId: "CUDTV61VL1BZ",
  },
  {
    id: "meta-ux-ui",
    title: "Principles of UX/UI Design",
    issuer: "Meta",
    date: "October 2025",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/OR4OXFF5AVWR",
    credentialId: "OR4OXFF5AVWR",
  },
];

function Certifications() {
  const { t } = useTranslation();

  if (certifications.length === 0) return null;

  return (
    <>
      <FadeIn>
        <h1 className="project-heading">
          {t("about.myCertsPre")}{" "}
          <strong className="purple">{t("about.myCertsHighlight")}</strong>
        </h1>
      </FadeIn>
      <Row
        style={{ justifyContent: "center", paddingBottom: "30px" }}
        className="certifications-row"
      >
        {certifications.map((c, i) => (
          <Col md={4} key={c.id} className="cert-col">
            <FadeIn delay={i * 0.08}>
              <article className="cert-card">
                <div className="cert-icon" aria-hidden="true">
                  <FaCertificate />
                </div>
                <h3 className="cert-title">{c.title}</h3>
                <p className="cert-issuer">{c.issuer}</p>
                <p className="cert-date">{c.date}</p>
                {c.credentialId && (
                  <p className="cert-id">
                    {t("about.credentialId")} <span>{c.credentialId}</span>
                  </p>
                )}
                {c.credentialUrl && (
                  <a
                    href={c.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-link"
                  >
                    {t("about.viewCredential")}{" "}
                    <HiOutlineExternalLink aria-hidden="true" />
                  </a>
                )}
              </article>
            </FadeIn>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default Certifications;
