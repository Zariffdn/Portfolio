import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiSend, FiCheck } from "react-icons/fi";
import { Container, Section, Button, Reveal } from "../ui";
import { useToast } from "../../contexts/ToastContext";
import "../../styles/about-sections.css";

// To enable the form:
//   1. Sign up free at https://formspree.io
//   2. Create a new form, copy the endpoint URL (looks like
//      https://formspree.io/f/abc123xyz)
//   3. Paste it below in place of the empty string
// Until this is filled in, submitting the form shows a friendly "not yet
// configured" toast instead of trying to POST.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkoepdvd";

const EMAIL = "zariffdanial.zul@gmail.com";

function Contact() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [sending, setSending] = useState(false);
  const [justSent, setJustSent] = useState(false);

  // The fetch and the 4s "sent" reset can outlive this section when the user
  // navigates away mid-submit, so every setState that follows an await or a
  // timer checks this ref, and the timer is cleared on unmount.
  const mountedRef = useRef(true);
  const sentTimerRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (sentTimerRef.current !== null) {
        window.clearTimeout(sentTimerRef.current);
        sentTimerRef.current = null;
      }
    };
  }, []);

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
        if (mountedRef.current) {
          setJustSent(true);
          if (sentTimerRef.current !== null) {
            window.clearTimeout(sentTimerRef.current);
          }
          sentTimerRef.current = window.setTimeout(() => {
            sentTimerRef.current = null;
            if (mountedRef.current) setJustSent(false);
          }, 4000);
        }
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      showToast(t("contact.error"), { icon: "❌" });
    } finally {
      if (mountedRef.current) setSending(false);
    }
  };

  return (
    <Section hairline id="contact" className="contact-section">
      <Container>
        <div className="contact">
          <Reveal className="contact__intro">
            <span className="eyebrow">{t("home.ctaEyebrow")}</span>
            <h2>
              {t("contact.headingPre") + " " + t("contact.headingHighlight")}
            </h2>
            <p className="lead">{t("contact.subtitle")}</p>
            <dl className="meta-list contact__meta">
              <dt>{t("contact.emailLabel")}</dt>
              <dd>
                <a href={"mailto:" + EMAIL}>{EMAIL}</a>
              </dd>
              <dt>{t("aboutCard.metaLocationLabel")}</dt>
              <dd>{t("aboutCard.metaLocationValue")}</dd>
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="contact__form"
              noValidate={false}
            >
              <div className="contact__row">
                <div className="contact__field">
                  <label
                    htmlFor="contact-name"
                    className="eyebrow eyebrow--plain"
                  >
                    {t("contact.nameLabel")}
                  </label>
                  <input
                    id="contact-name"
                    className="contact__input"
                    type="text"
                    name="name"
                    placeholder={t("contact.namePlaceholder")}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="contact__field">
                  <label
                    htmlFor="contact-email"
                    className="eyebrow eyebrow--plain"
                  >
                    {t("contact.emailLabel")}
                  </label>
                  <input
                    id="contact-email"
                    className="contact__input"
                    type="email"
                    name="email"
                    placeholder={t("contact.emailPlaceholder")}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="contact__field">
                <label
                  htmlFor="contact-subject"
                  className="eyebrow eyebrow--plain"
                >
                  {t("contact.subjectLabel")}
                </label>
                <input
                  id="contact-subject"
                  className="contact__input"
                  type="text"
                  name="subject"
                  placeholder={t("contact.subjectPlaceholder")}
                />
              </div>

              <div className="contact__field">
                <label
                  htmlFor="contact-message"
                  className="eyebrow eyebrow--plain"
                >
                  {t("contact.messageLabel")}
                </label>
                <textarea
                  id="contact-message"
                  className="contact__input"
                  rows={5}
                  name="message"
                  placeholder={t("contact.messagePlaceholder")}
                  required
                />
              </div>

              <div className="contact__actions">
                <Button
                  type="submit"
                  variant="primary"
                  icon={justSent ? <FiCheck /> : <FiSend />}
                  iconPosition="start"
                  className={justSent ? "is-sent" : ""}
                  disabled={sending || justSent}
                >
                  {justSent
                    ? t("contact.sent")
                    : sending
                    ? t("contact.sending")
                    : t("contact.send")}
                </Button>
              </div>
            </form>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export default Contact;
