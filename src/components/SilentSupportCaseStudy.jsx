import { useTranslation } from "react-i18next";
import { FiGithub } from "react-icons/fi";
import {
  Container,
  Section,
  Chip,
  Reveal,
  Stagger,
  StaggerItem,
  PhoneFrame,
} from "./ui";
import { Block, CaseStudyEnd, CaseStudyTop } from "./CaseStudy";
import { silentSupportScreens } from "../data/screenshots";
import usePageMeta from "../hooks/usePageMeta";
import "../styles/casestudy.css";

// Every fact on this page comes from the public repository below: the app
// (app/, src/), the two Supabase Edge Functions and the three migrations.
// The timings and limits quoted are constants in that code.
const REPO = "https://github.com/Zariffdn/Silent-Support-App";

// silentSupportScreens is [check-in, history, response]; the band shows them
// in the order a visit runs. No alt transcribes a time or a count.
const [checkIn, history, response] = silentSupportScreens;
const screens = [
  {
    src: checkIn,
    alt: "Check-in screen asking What are you feeling?, with eight feelings in a two-column grid, from Bad Day to Anxiety Spike",
    caption: "Check in",
  },
  {
    src: response,
    alt: "Response screen: a short, calm reply under the chosen feeling, with a Breathe with me button",
    caption: "Reply",
  },
  {
    src: history,
    alt: "Looking back screen: two gentle reflections, a count of each feeling over the past seven days, and the day's check-ins",
    caption: "Looking back",
  },
];

// The band's frames render 220px wide on desktop and 138px under 880px
// (casestudy.css), so a 2x phone can still take the 300w file.
const SCREEN_SIZES = "(max-width: 880px) 138px, 220px";

// What one tap sets off, in order. `where` is the side each step runs on.
const flow = [
  {
    title: "Tap a feeling",
    where: "Phone",
    text: "The grid locks on the first tap, so a double tap cannot open two replies.",
  },
  {
    title: "Pick a depth",
    where: "Phone",
    text:
      "The last seven days of history on the phone set a level: 1 for a " +
      "passing feeling, 2 when it keeps returning or hard days cluster, 3 " +
      "only for a genuinely heavy week. It is never shown.",
  },
  {
    title: "Show a written reply",
    where: "Phone",
    text:
      "One of two written replies for that feeling and level is on screen " +
      "from the first frame. No spinner.",
  },
  {
    title: "Ask in the background",
    where: "Phone",
    text:
      "The app posts the feeling's id and the level to a Supabase Edge " +
      "Function, and aborts the request at 2,500 ms.",
  },
  {
    title: "Build the prompt",
    where: "Edge Function",
    text:
      "The id maps to a label and tone notes from an allowlist, and the " +
      "level must be 1, 2 or 3, so no client text reaches the prompt.",
  },
  {
    title: "Write a new reply",
    where: "Groq",
    text:
      "A Llama model on Groq writes a fresh reply at the same depth, within " +
      "a four-second timeout.",
  },
  {
    title: "Filter it",
    where: "Edge Function",
    text:
      "The tone filter (block 05) runs. A rejected or failed reply becomes " +
      "the function's own written one.",
  },
  {
    title: "Swap or keep",
    where: "Phone",
    text:
      "Only an AI reply that arrived inside the window fades in. Otherwise " +
      "the written reply stays.",
  },
];

// sanitizeAi() as written, rewrapped so no line passes 36 characters and the
// excerpt does not wrap at 390px.
const sanitizer = String.raw`function sanitizeAi(
  raw: string | null,
): string | null {
  if (!raw) return null;
  let t = raw
    .replace(EMOJI, '')
    // collapse spaces, keep newlines
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    // at most one blank line
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  if (!t) return null;
  if (t.includes('?')) return null;
  if (t.includes('!')) return null;
  const lower = t.toLowerCase();
  if (BANNED.some((p) =>
    lower.includes(p))) return null;
  if (t.length < 10 ||
    t.length > 800) return null;
  return t;
}`;

function Code({ label, children }) {
  return (
    <figure className="cs-code">
      <pre>
        <code>{children}</code>
      </pre>
      <figcaption className="mono cs-art__caption">{label}</figcaption>
    </figure>
  );
}

function SilentSupportCaseStudy() {
  const { t } = useTranslation();

  usePageMeta({
    title: t("meta.silentSupport"),
    description: t("meta.silentSupportDesc"),
  });

  return (
    <div className="cs-page" lang="en">
      {/* 1. Top bar */}
      <CaseStudyTop />

      {/* 2. Hero */}
      <Section flushTop>
        <Container narrow>
          <header className="cs-hero">
            <span className="eyebrow cs-rise">Case study · Personal project</span>
            <h1 className="display cs-rise">Silent Support</h1>
            <p className="lead cs-rise">
              A private place to check in when feelings are heavy and words are
              hard. Tap one of eight feelings and a calm, written reply is on
              screen at once. An AI reply can take its place, but only if it
              arrives within 2.5 seconds and passes a tone filter on the server.
            </p>
            <dl className="meta-list cs-meta cs-rise">
              <div>
                <dt>Role</dt>
                <dd>Solo: app, backend and prompt</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>MVP, version 0.1.0</dd>
              </div>
              <div className="cs-meta__span">
                <dt>Stack</dt>
                <dd>
                  React Native (Expo), TypeScript, Supabase (Auth, Postgres,
                  Edge Functions), Groq (Llama)
                </dd>
              </div>
              <div className="cs-meta__span">
                <dt>Code</dt>
                <dd>
                  <a href={REPO} target="_blank" rel="noopener noreferrer">
                    github.com/Zariffdn/Silent-Support-App
                  </a>
                </dd>
              </div>
            </dl>
            <p className="text-3 small cs-caption cs-rise">
              Written from the public repository: the app, two Supabase Edge
              Functions and three database migrations.
            </p>
          </header>
        </Container>
      </Section>

      {/* 3. Screens band */}
      <Section tone="alt" hairline tight>
        <Container>
          {/* Under 880px the band scrolls sideways, so keyboard users need to
              be able to focus it to reach the other screens (WCAG 2.1.1). */}
          <Stagger
            className="cs-screens"
            gap={0.1}
            tabIndex={0}
            role="region"
            aria-label="Silent Support app screenshots"
          >
            {screens.map((screen) => (
              <StaggerItem key={screen.src} as="figure" className="cs-screens__item">
                <PhoneFrame src={screen.src} alt={screen.alt} sizes={SCREEN_SIZES} />
                <figcaption className="mono cs-art__caption cs-screens__caption">
                  {screen.caption}
                </figcaption>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* 4. Headline moment */}
      <Section tight>
        <Container>
          <Reveal>
            <div className="cs-moment">
              <p className="cs-moment__line">
                <span>A reply at 0&nbsp;ms.</span>{" "}
                <span>AI only inside 2.5&nbsp;s.</span>
              </p>
              <span className="eyebrow eyebrow--plain cs-moment__label">
                The rule behind every tap
              </span>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 5. Body */}
      <Section hairline>
        <Container narrow>
          <div className="cs-blocks">
            <Block index="01" title="The problem">
              <div className="prose">
                <p>
                  When feelings get heavy, words are often the first thing to
                  go. Silent Support asks for none: there is no text box. You
                  tap a feeling, read a few calm lines, and can open a
                  breathing screen from there.
                </p>
                <p>
                  It is deliberately small, with no social features,
                  notifications or gamification, and it is not a therapist or
                  a chatbot. Its core rule, named in the code, is presence over
                  intelligence: the written reply comes first, and the AI
                  never makes anyone wait.
                </p>
              </div>
            </Block>

            <Block index="02" title="How a reply is chosen">
              <div className="prose">
                <p>The first three steps finish before anything touches the network.</p>
              </div>
              <ol className="cs-trace">
                {flow.map((step, i) => (
                  <li key={step.title} className="cs-trace__step">
                    <span className="cs-trace__index" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="cs-trace__body">
                      <div className="cs-trace__head">
                        <h3 className="cs-trace__title">{step.title}</h3>
                        <Chip className="cs-trace__beat">{step.where}</Chip>
                      </div>
                      <p className="cs-trace__text text-2">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Block>

            <Block index="03" title="What the server never sees">
              <div className="prose">
                <p>
                  A tap sends two values, the feeling&apos;s id and the level,
                  with the app&apos;s public key rather than a user session, so
                  the request carries no account.
                </p>
              </div>
              <ul className="cs-list text-2">
                <li>
                  <strong>The history behind the level stays on the phone.</strong>{" "}
                  So do a one-line aside such as &ldquo;You&apos;ve been
                  checking in consistently lately&rdquo; and a check that can
                  offer the Help screen after a sustained run of difficult
                  days. Both are worked out locally and never sent.
                </li>
                <li>
                  <strong>Accounts are optional.</strong> Signed out, check-ins
                  stay on the phone. Signed in with an emailed code, they back
                  up as an id, a feeling and a time, and row level security
                  limits every row to its owner.
                </li>
                <li>
                  <strong>Three migrations got there.</strong> The first let
                  anonymous clients write, flagged in a comment as security
                  debt; the second dropped that and emptied the table; the
                  third added owner-only policies.
                </li>
                <li>
                  <strong>Account deletion runs on the server.</strong> An Edge
                  Function takes the caller from their own token, never an id
                  in the request, and a cascade removes their check-ins.
                </li>
              </ul>
            </Block>

            <Block index="04" title="Sync that never drops a check-in">
              <div className="prose">
                <p>
                  Sync runs at sign-in and whenever the app returns to the
                  foreground. Sync never throws: any error is caught and the
                  copy on the phone stays intact, so a failure never touches
                  the reply.
                </p>
              </div>
              <ul className="cs-list text-2">
                <li>
                  Every check-in on the phone, from before and after sign-in,
                  goes into a map keyed by its id.
                </li>
                <li>
                  They upload with an upsert that skips known ids, so a second
                  run changes nothing.
                </li>
                <li>
                  The account&apos;s rows are pulled into the same map, where
                  they can only add.
                </li>
                <li>
                  The union is saved on the phone, and only then is the
                  signed-out store cleared.
                </li>
                <li>
                  A new check-in is saved locally first; if its insert fails,
                  the next sync uploads it.
                </li>
              </ul>
            </Block>

            <Block index="05" title="The tone filter">
              <div className="prose">
                <p>
                  The prompt asks for calm, complete sentences with no emojis,
                  exclamation marks, questions or clinical words. A prompt can
                  only ask, so the function checks before a reply leaves:
                </p>
              </div>
              <ul className="cs-list text-2">
                <li>Emoji are stripped, keeping the blank lines between parts.</li>
                <li>A question or exclamation mark rejects the reply.</li>
                <li>So does one of eleven stock phrases, such as &ldquo;chin up&rdquo;.</li>
                <li>So does anything under 10 or over 800 characters.</li>
              </ul>
              <Code label="sanitizeAi() in supabase/functions/generate-support/index.ts, lines 155 to 170 (rewrapped)">
                {sanitizer}
              </Code>
            </Block>

            <Block index="06" title="Limits and what is not there yet">
              <ul className="cs-list text-2">
                <li>
                  <strong>No tests or linter yet.</strong> The only check is
                  the TypeScript compiler, and its config excludes the Edge
                  Functions.
                </li>
                <li>
                  <strong>Sync only adds.</strong> Clearing history deletes the
                  account&apos;s rows and this phone&apos;s copy, but another
                  signed-in phone would upload its copy again at its next sync;
                  the clear dialog warns about it. A clear that reaches every
                  device needs sync to record deletions.
                </li>
                <li>
                  <strong>Two copies kept in step by hand.</strong> The
                  feelings, labels and fallback replies live in both the app
                  and the function.
                </li>
                <li>
                  <strong>The crisis keyword check is dormant,</strong> since
                  there is no text input. The live safety path is a Help screen
                  of crisis lines in Malaysia and an international directory.
                </li>
              </ul>
              <div className="prose">
                <p>
                  The code is public: the app, both Edge Functions and the
                  migrations.
                </p>
              </div>
              <div className="cs-block__cta">
                <a
                  href={REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-arrow"
                >
                  <FiGithub aria-hidden="true" /> View the code on GitHub
                </a>
              </div>
            </Block>
          </div>

          {/* 6. Contact, next case study and the way back */}
          <CaseStudyEnd current="/silent-support" />
        </Container>
      </Section>
    </div>
  );
}

export default SilentSupportCaseStudy;
