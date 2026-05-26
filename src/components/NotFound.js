import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Particle from "./Particle";
import usePageMeta from "../hooks/usePageMeta";

function NotFound() {
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
            <h2 style={{ marginBottom: "1rem" }}>Page not found</h2>
            <p style={{ opacity: 0.85, marginBottom: "1.5rem" }}>
              Looks like this page took a wrong turn. The link might be broken
              or the page may have moved.
            </p>
            <Button as={Link} to="/" variant="primary">
              Take me home
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default NotFound;
