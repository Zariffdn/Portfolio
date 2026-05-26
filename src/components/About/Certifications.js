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
  // Example shape — uncomment and edit when ready:
  // {
  //   id: "google-flutter",
  //   title: "Flutter Development Professional",
  //   issuer: "Google",
  //   date: "March 2025",
  //   credentialUrl: "https://www.credly.com/badges/...",
  //   credentialId: "ABC123XYZ",
  // },
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
