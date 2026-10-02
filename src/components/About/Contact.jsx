import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiSend, FiCheck } from "react-icons/fi";
import { Container, Section, Button, Reveal } from "../ui";
import "../../styles/about-sections.css";

// Formspree form endpoint. Submissions go out as JSON-accepting POSTs, so a
// failure comes back as a status code rather than a redirect.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xkoepdvd";

const EMAIL = "zariffdanial.zul@gmail.com";

// Formspree takes the notification email's subject line from the subject
// field, the only name its docs have given for it since 2022.
const SUBJECT_PREFIX = "Portfolio: ";

// How long the button keeps its "sent" label before it can send again.
const SENT_RESET_MS = 4000;

function Contact() {
  const { t } = useTranslation();
  const [sending, setSending] = useState(false);
  const [justSent, setJustSent] = useState(false);
  // The outcome of the last submit, shown under the button until the next
  // input or submit: "idle" | "success" | "error".
  const [result, setResult] = useState("idle");

  // The fetch and the "sent" reset can outlive this section when the user
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

  const busy = sending || justSent;

  const clearResult = () => {
    if (result !== "idle") setResult("idle");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // The button stays focusable while busy (aria-disabled, not disabled),
    // so Enter in a field or on the button can still land here.
    if (busy) return;
    setResult("idle");
    setSending(true);

    const formEl = e.currentTarget;
    const data = new FormData(formEl);
    const subject = String(data.get("subject") || "").trim();
    data.delete("subject");
    if (subject) data.set("subject", SUBJECT_PREFIX + subject);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!response.ok) throw new Error("Submission failed");
      formEl.reset();
      if (!mountedRef.current) return;
      setResult("success");
      setJustSent(true);
      if (sentTimerRef.current !== null) {
        window.clearTimeout(sentTimerRef.current);
      }
      sentTimerRef.current = window.setTimeout(() => {
        sentTimerRef.current = null;
        if (mountedRef.current) setJustSent(false);
      }, SENT_RESET_MS);
    } catch {
      if (mountedRef.current) setResult("error");
    } finally {
      if (mountedRef.current) setSending(false);
    }
  };

  let buttonLabel = t("contact.send");
  if (justSent) buttonLabel = t("contact.sent");
  else if (sending) buttonLabel = t("contact.sending");

  return (
    <Section hairline id="contact" className="contact-section">
      <Container>
        <div className="contact">
          <Reveal className="contact__intro">
            <h2>{t("contact.title")}</h2>
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
              onInput={clearResult}
              className="contact__form"
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

              {/* Formspree's honeypot: people never see or reach it, so a
                  value here marks the submission as spam. */}
              <input
                type="text"
                name="_gotcha"
                className="contact__gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="contact__actions">
                <Button
                  type="submit"
                  variant="primary"
                  icon={justSent ? <FiCheck /> : <FiSend />}
                  iconPosition="start"
                  aria-disabled={busy || undefined}
                >
                  {buttonLabel}
                </Button>
              </div>

              {/* Always in the DOM so screen readers announce each change. */}
              <p
                className={`contact__status contact__status--${result}`}
                role="status"
              >
                {result === "success" && t("contact.success")}
                {result === "error" && (
                  <>
                    {t("contact.error")}{" "}
                    <a href={"mailto:" + EMAIL}>{EMAIL}</a>
                  </>
                )}
              </p>
            </form>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export default Contact;
