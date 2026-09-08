import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { Container, Section, Chip, Reveal } from "./ui";
import cardArt from "../Assets/Projects/bestinet.svg";
import usePageMeta from "../hooks/usePageMeta";
import "../styles/casestudy.css";

// The generation chain, top to bottom, in the order the trace walked it.
// `defect` marks the two steps that were actually broken.
const trace = [
  {
    title: "View layer",
    text:
      "The authenticator screen mounts and binds to its GetX controller, " +
      "expecting the controller to hold a code it can show. It never called " +
      "the controller's init routine, so nothing below this line ever ran.",
    defect: true,
  },
  {
    title: "Controller init",
    text:
      "The init routine is where the key lookup and code generation are " +
      "started. Once the view actually called it, it ran, and the trace " +
      "moved on to the next failure.",
    defect: false,
  },
  {
    title: "Secure-storage read",
    text:
      "The routine reads the device key and the secret key from " +
      "flutter_secure_storage. An invalid type cast on that read threw on " +
      "any device that was already enrolled.",
    defect: true,
  },
  {
    title: "Error handler",
    text:
      "The throw landed in a catch block that swallowed it. No crash, no " +
      "message, just an empty space where the code should have been.",
    defect: false,
  },
  {
    title: "Code generation",
    text:
      "The generator computes the time-based code from the secret and the " +
      "current 30-second window. A failed lookup could still reach it and " +
      "generate from an empty key.",
    defect: false,
  },
  {
    title: "Displayed code",
    text: "The screen renders whatever the controller holds. Nothing in, nothing out.",
    defect: false,
  },
];

function BackLink({ className = "" }) {
  return (
    <Link to="/project" className={`link-arrow cs-back ${className}`.trim()}>
      <FiArrowLeft aria-hidden="true" /> Back to Projects
    </Link>
  );
}

// Two-digit mono index + hairline above every body block.
function Block({ index, title, children }) {
  return (
    <Reveal as="section" className="cs-block">
      <span className="eyebrow eyebrow--plain cs-block__index">{index}</span>
      <h2>{title}</h2>
      {children}
    </Reveal>
  );
}

function BestinetCaseStudy() {
  const { t } = useTranslation();

  usePageMeta({
    title: t("meta.bestinet"),
    description:
      "Engineering case study on an internal TOTP authenticator app at Bestinet Sdn Bhd, where Zariff Danial traced a broken Flutter code generation path to two defects, fixed and hardened it, and built the authenticator screen to a supplied design.",
  });

  return (
    <div className="cs-page">
      {/* 1. Top bar */}
      <Section tight>
        <Container narrow>
          <div className="cs-rise">
            <BackLink />
          </div>
        </Container>
      </Section>

      {/* 2. Hero */}
      <Section flushTop>
        <Container narrow>
          <header className="cs-hero">
            <span className="eyebrow cs-rise">Case study · Company work</span>
            <h1 className="display cs-rise">TOTP authenticator</h1>
            <p className="lead cs-rise">
              An internal Flutter authenticator app in Bestinet's Research and
              Development department, where the TOTP feature was already
              written but never showed a code on screen. My remit was to find
              out why, make it generate and display correctly, then build the
              authenticator screen to a design I was given.
            </p>
            <dl className="meta-list cs-meta cs-rise">
              <div>
                <dt>Company</dt>
                <dd>Bestinet Sdn Bhd</dd>
              </div>
              <div>
                <dt>Department</dt>
                <dd>Research and Development</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>Mobile Application Developer, contract</dd>
              </div>
              <div>
                <dt>Period</dt>
                <dd>July 2025 to November 2025</dd>
              </div>
              <div className="cs-meta__span">
                <dt>Stack</dt>
                <dd>Flutter, Dart, GetX, flutter_secure_storage, TOTP</dd>
              </div>
            </dl>
            <p className="text-3 small cs-caption cs-rise">
              Company work under contract. The app is internal and the code is
              proprietary, so this page describes the work without screenshots
              or a repository link.
            </p>
          </header>
        </Container>
      </Section>

      {/* 3. Card art band */}
      <Section tone="alt" hairline tight>
        <Container>
          <Reveal as="figure" className="cs-art">
            <div className="surface cs-art__panel">
              <img
                src={cardArt}
                alt="Card art: a thirty-second countdown ring above a six-digit one-time code"
                width="1280"
                height="800"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption className="mono cs-art__caption">
              Card art; the real app is proprietary
            </figcaption>
          </Reveal>
        </Container>
      </Section>

      {/* 4. Headline moment */}
      <Section tight>
        <Container>
          <Reveal>
            <div className="cs-moment">
              <p className="cs-moment__line">Two defects, one silent failure.</p>
              <span className="eyebrow eyebrow--plain cs-moment__label">
                What the trace found
              </span>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 5. Body */}
      <Section hairline>
        <Container narrow>
          <div className="cs-blocks">
            <Block index="01" title="Context">
              <div className="prose">
                <p>
                  Bestinet's Research and Development department had an
                  internal Flutter authenticator app built on GetX. The TOTP
                  feature was already in the codebase, along with the
                  enrolment flow and the secure-storage scheme that holds the
                  secret. It just never produced a code: open the
                  authenticator and the space where the code should be
                  stayed empty.
                </p>
                <p>
                  I joined the department on a contract as a mobile
                  application developer. The remit was narrow and clear: find
                  out why the code never appeared, make it generate and
                  display correctly, and then build the authenticator screen
                  to a design that was supplied to me.
                </p>
              </div>
            </Block>

            <Block index="02" title="The trace">
              <div className="prose">
                <p>
                  Rather than guess at the cause, I wrote a numbered trace
                  through the generation chain, from the widget that should
                  show the code down to the routine that computes it, and
                  checked each step in turn. Two of them were broken.
                </p>
              </div>
              <ol className="cs-trace">
                {trace.map((step, i) => (
                  <li
                    key={step.title}
                    className={`cs-trace__step ${step.defect ? "cs-trace__step--defect" : ""}`.trim()}
                  >
                    <span className="cs-trace__index" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="cs-trace__body">
                      <div className="cs-trace__head">
                        <h3 className="cs-trace__title">{step.title}</h3>
                        {step.defect && (
                          <Chip className="cs-trace__flag">Defect</Chip>
                        )}
                      </div>
                      <p className="cs-trace__text text-2">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Block>

            <Block index="03" title="The fixes">
              <div className="prose">
                <p>
                  Two small changes cleared the two defects. The view layer
                  now calls the controller's init routine, and the cast on
                  the secure-storage read was corrected so it no longer
                  throws on an enrolled device.
                </p>
                <p>
                  Getting a code on screen was not the end of it. The chain
                  had failed silently once, so I hardened the path it runs
                  through:
                </p>
              </div>
              <ul className="cs-list text-2">
                <li>
                  <strong>Generation is wrapped in error handling,</strong>{" "}
                  so a fault in the chain surfaces where it can be seen
                  instead of vanishing into a catch block.
                </li>
                <li>
                  <strong>
                    A failed device or secret-key lookup returns early.
                  </strong>{" "}
                  A code is never generated from an empty key.
                </li>
              </ul>
              <div className="prose">
                <p>
                  The storage scheme and the generation routine were already
                  there and stayed as they were. The work was making the
                  existing chain run end to end, and fail loudly when it
                  cannot.
                </p>
              </div>
            </Block>

            <Block index="04" title="The screen">
              <div className="prose">
                <p>
                  Once codes were generating, I built the authenticator screen
                  to the design I was given.
                </p>
              </div>
              <ul className="cs-list text-2">
                <li>A countdown ring tied to the 30-second refresh window.</li>
                <li>The code rendered digit by digit, matching the supplied design.</li>
                <li>The existing tap to copy, kept as it was.</li>
                <li>
                  The same supplied branding applied to the app shell and the
                  login screen.
                </li>
              </ul>
            </Block>

            <Block index="05" title="What it taught me">
              <ul className="cs-list text-2">
                <li>
                  <strong>Read the whole chain before touching code.</strong>{" "}
                  A quick fix for the first defect would have shipped an app
                  that still failed on every enrolled device; the trace only
                  found the second because it kept going.
                </li>
                <li>
                  <strong>A swallowed exception hides the real fault.</strong>{" "}
                  The screen was empty, not crashing, so the bad cast was
                  invisible until the trace reached the storage read.
                </li>
                <li>
                  <strong>Hardening is cheap once the failure modes are known.</strong>{" "}
                  An early return and error handling around generation are
                  small additions, and they mean a code is never produced from
                  an empty key.
                </li>
              </ul>
            </Block>

            <Block index="06" title="No repository">
              <div className="prose">
                <p>
                  The code belongs to Bestinet, so there is no repository to
                  link and no real screenshots on this page; the card art
                  above stands in for the screen. The rest of my work is on
                  the Projects page.
                </p>
              </div>
              <div className="cs-block__cta">
                <Link to="/project" className="link-arrow">
                  See all projects <FiArrowRight aria-hidden="true" />
                </Link>
              </div>
            </Block>
          </div>

          {/* 6. Bottom back link */}
          <Reveal>
            <BackLink className="cs-back--bottom" />
          </Reveal>
        </Container>
      </Section>
    </div>
  );
}

export default BestinetCaseStudy;
