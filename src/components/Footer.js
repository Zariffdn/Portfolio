import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AiFillGithub, AiOutlineMail } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  let date = new Date();
  let year = date.getFullYear();
  return (
    <Container fluid className="footer">
      <Row>
        <Col md="4" className="footer-copywright">
          <h3>{t("footer.developedBy")}</h3>
        </Col>
        <Col md="4" className="footer-copywright">
          <h3>
            {t("footer.copyright")} © {year} ZD{" "}
            <span className="footer-sep" aria-hidden="true">·</span>{" "}
            <Link to="/uses" className="footer-link">
              {t("footer.uses")}
            </Link>{" "}
            <span className="footer-sep" aria-hidden="true">·</span>{" "}
            <a
              href="https://github.com/Zariffdn/Portfolio"
              className="footer-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("footer.viewSource")}
            </a>
          </h3>
        </Col>
        <Col md="4" className="footer-body">
          <ul className="footer-icons">
            <li className="social-icons">
              <a
                href="https://github.com/Zariffdn"
                style={{ color: "var(--text-primary)" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <AiFillGithub />
              </a>
            </li>
 
            <li className="social-icons">
              <a
                href="https://www.linkedin.com/in/zariffdanial/"
                style={{ color: "var(--text-primary)" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
            </li>

            <li className="social-icons">
              <a
                href="mailto:zariffdanial.zul@gmail.com"
                style={{ color: "var(--text-primary)" }}
                aria-label="Email Zariff"
              >
                <AiOutlineMail />
              </a>
            </li>

          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
