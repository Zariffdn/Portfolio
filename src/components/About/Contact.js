import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FiSend } from "react-icons/fi";
import FadeIn from "../FadeIn";
import { useToast } from "../../contexts/ToastContext";

// To enable the form:
//   1. Sign up free at https://formspree.io
//   2. Create a new form, copy the endpoint URL (looks like
//      https://formspree.io/f/abc123xyz)
//   3. Paste it below in place of the empty string
// Until this is filled in, submitting the form shows a friendly "not yet
// configured" toast instead of trying to POST.
const FORMSPREE_ENDPOINT = "";

function Contact() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!FORMSPREE_ENDPOINT) {
      showToast(t("contact.notConfigured"), { icon: "⚠️" });
      return;
    }
    setSending(true);
    try {
      const formEl = e.target;
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(formEl),
      });
      if (response.ok) {
        showToast(t("contact.success"), { icon: "✅" });
        formEl.reset();
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      showToast(t("contact.error"), { icon: "❌" });
    } finally {
      setSending(false);
    }
  };

  return (
    <FadeIn>
      <h1 className="project-heading">
        {t("contact.headingPre")}{" "}
        <strong className="purple">{t("contact.headingHighlight")}</strong>
      </h1>
      <Container className="contact-container">
        <Row style={{ justifyContent: "center" }}>
          <Col md={9} lg={8}>
            <p className="contact-subtitle">{t("contact.subtitle")}</p>
            <Form
              onSubmit={handleSubmit}
              className="contact-form"
              noValidate={false}
            >
              <Row>
                <Col md={6}>
                  <Form.Group controlId="contact-name" className="contact-field">
                    <Form.Label>{t("contact.nameLabel")}</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder={t("contact.namePlaceholder")}
                      required
                      autoComplete="name"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="contact-email" className="contact-field">
                    <Form.Label>{t("contact.emailLabel")}</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder={t("contact.emailPlaceholder")}
                      required
                      autoComplete="email"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="contact-subject" className="contact-field">
                <Form.Label>{t("contact.subjectLabel")}</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  placeholder={t("contact.subjectPlaceholder")}
                />
              </Form.Group>
              <Form.Group controlId="contact-message" className="contact-field">
                <Form.Label>{t("contact.messageLabel")}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  placeholder={t("contact.messagePlaceholder")}
                  required
                />
              </Form.Group>
              <div className="contact-actions">
                <Button
                  type="submit"
                  variant="primary"
                  className="contact-submit"
                  disabled={sending}
                >
                  <FiSend aria-hidden="true" />
                  &nbsp;
                  {sending ? t("contact.sending") : t("contact.send")}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </FadeIn>
  );
}

export default Contact;
