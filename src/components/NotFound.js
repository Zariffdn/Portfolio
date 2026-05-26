import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Particle from "./Particle";
import usePageMeta from "../hooks/usePageMeta";
import { useTranslation } from "react-i18next";

function NotFound() {
  const { t } = useTranslation();
  usePageMeta({
    title: "404 — Zariff Danial",
    description: "The page you're looking for doesn't exist.",
  });

  return (
    <Container fluid className="about-section">
      <Particle />
      <Container>
        <Row
          style={{
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            textAlign: "center",
          }}
        >
          <Col md={8}>
            <h1
              style={{
                fontSize: "6em",
                marginBottom: 0,
                color: "var(--imp-text-color)",
              }}
            >
              404
            </h1>
            <h2 style={{ marginBottom: "1rem" }}>{t("notFound.title")}</h2>
            <p style={{ opacity: 0.85, marginBottom: "1.5rem" }}>
              {t("notFound.desc")}
            </p>
            <Button as={Link} to="/" variant="primary">
              {t("notFound.takeMeHome")}
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default NotFound;
