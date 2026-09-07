import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import { FaNewspaper } from "react-icons/fa";
import {
  Container,
  Section,
  Chip,
  Reveal,
  Stagger,
  StaggerItem,
  PhoneFrame,
} from "./ui";
import StoreLinks from "./StoreLinks";
import { screenshots, lifetimeInstalls, press } from "../data/mytax";
import usePageMeta from "../hooks/usePageMeta";
import { formatMonth } from "../utils/formatMonth";
import "../styles/casestudy.css";

const techStack = [
  { group: "Core", items: ["Flutter", "Dart"] },
  { group: "State Management", items: ["Provider"] },
  { group: "Networking", items: ["Dio", "Retry", "HTTP"] },
  {
    group: "Authentication",
    items: ["local_auth (biometric)", "Shared Preferences"],
  },
  {
    group: "PDF & Documents",
    items: ["Syncfusion PDF Viewer", "pdf"],
  },
  {
    group: "Push (iOS / Android)",
    items: [
      "Firebase Messaging",
      "Flutter Local Notifications",
      "Overlay Support",
    ],
  },
  {
    group: "Push (Huawei)",
    items: ["huawei_push (HMS Push Kit)", "Flutter Local Notifications"],
  },
  {
    group: "Camera & Scanning",
    items: ["mobile_scanner (QR/barcode)", "Camera", "Image Picker"],
  },
  {
    group: "WebViews & HTML",
    items: ["flutter_inappwebview", "webview_flutter", "flutter_html"],
  },
  {
    group: "Location & Maps",
    items: ["Geolocator", "Geocoding", "Map Launcher"],
  },
  {
    group: "Localization",
    items: ["flutter_localizations", "intl (EN / Bahasa Malaysia)"],
  },
];

const facts = [
  ["Min OS", "iOS 15+ · Android 9 (API 28)+"],
  ["Distribution", "iOS · Android · Huawei AppGallery (HMS)"],
  ["App size", "100 to 200 MB per platform"],
  ["Current version", "1.0.48 (build 69)"],
  ["Latest release", "May 2026"],
  ["Update cadence", "Roughly monthly"],
];

const article = press[0];

function BackLink({ className = "" }) {
  return (
    <Link to="/about" className={`link-arrow cs-back ${className}`.trim()}>
      <FiArrowLeft aria-hidden="true" /> Back to About
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

function MyTaxCaseStudy() {
  const { t } = useTranslation();

  usePageMeta({
    title: t("meta.mytax"),
    description:
      "Engineering case study on the MyTax mobile app, Malaysia's official tax filing application maintained by Zariff Danial at Zen Computer Systems and deployed across iOS, Android, and Huawei AppGallery.",
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
            <span className="eyebrow cs-rise">Case study · Production work</span>
            <h1 className="display cs-rise">MyTax</h1>
            <p className="lead cs-rise">
              Malaysia's official income tax filing app, used by taxpayers
              nationwide. Maintained at Zen Computer Systems for the Inland
              Revenue Board (LHDN), live across three mobile ecosystems.
            </p>
            <dl className="meta-list cs-meta cs-rise">
              <div>
                <dt>Client</dt>
                <dd>LHDN Malaysia</dd>
              </div>
              <div>
                <dt>Company</dt>
                <dd>Zen Computer Systems</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>Sole Mobile Developer (MyTax)</dd>
              </div>
              <div>
                <dt>Period</dt>
                <dd>Nov 2025 to Present</dd>
              </div>
            </dl>
            <div className="cs-stores cs-rise">
              <StoreLinks />
            </div>
            <p className="text-3 small cs-caption cs-rise">
              Install counts as of May 2026. App Store figure is from
              App Store Connect analytics; Google Play and AppGallery
              are publicly visible on each store listing.
            </p>
          </header>
        </Container>
      </Section>

      {/* 3. Screens band */}
      <Section tone="alt" hairline tight>
        <Container>
          <Stagger className="cs-screens" gap={0.1}>
            {screenshots.map((src, i) => (
              <StaggerItem key={src} className="cs-screens__item">
                <PhoneFrame
                  src={src}
                  alt={`MyTax mobile app screenshot ${i + 1}`}
                  priority={i === 1}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* 4. Headline stat */}
      <Section tight>
        <Container>
          <Reveal>
            <div
              className="cs-stat"
              role="figure"
              aria-label="2.8 million plus lifetime installs across iOS, Android, and Huawei"
            >
              <div className="cs-stat__value tabular">{lifetimeInstalls}</div>
              <span className="eyebrow eyebrow--plain cs-stat__label">
                Lifetime installs across iOS, Android, and Huawei
              </span>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 5. Body */}
      <Section hairline>
        <Container narrow>
          <div className="cs-blocks">
            <Block index="01" title="Problem">
              <div className="prose">
                <p>
                  Filing income tax in Malaysia traditionally meant queuing
                  at LHDN branches, navigating a desktop portal, or
                  completing paper forms. That friction landed hardest on
                  working taxpayers and on anyone without easy desktop
                  access.
                </p>
                <p>
                  MyTax brings the full LHDN filing surface to the device
                  most Malaysians already carry. It handles e-Filing,
                  payment and refund history, e-KYC onboarding for new
                  taxpayers, and biometric login, shipped across iOS,
                  Android, and Huawei AppGallery so no major handset
                  segment is locked out.
                </p>
              </div>
            </Block>

            <Block index="02" title="Overview">
              <div className="prose">
                <p>
                  MyTax is the official mobile companion to the LHDN tax
                  filing platform. It lets Malaysian taxpayers file returns,
                  view payment and refund history, manage authentication,
                  and access tax services from their phone. The app ships to
                  three distinct mobile ecosystems: iOS via the Apple App
                  Store, Android via Google Play, and Huawei devices via
                  Huawei AppGallery. It has been in continuous production
                  since 2022 and is currently on version 1.0.48 (build 69),
                  with over 894,000 active installs on Google Play alone.
                </p>
              </div>
            </Block>

            <Block index="03" title="My role">
              <div className="prose">
                <p>
                  I'm the sole mobile developer assigned to MyTax. The rest
                  of the team on this product focuses on the web platform,
                  so anything that ships to phones for MyTax runs through
                  me. I own the MyTax mobile surface end-to-end: bug
                  fixes, releases, platform-specific adaptations,
                  localization, and feature shipping across iOS, Android,
                  and Huawei builds.
                </p>
                <p>
                  In practice, in any given week I might be investigating
                  a user-reported issue, adapting a feature for the
                  Huawei build (which runs in the HMS environment without
                  Google Mobile Services), keeping Bahasa Malaysia and
                  English strings aligned with the web platform's copy,
                  or integrating a new API endpoint the backend team has
                  just shipped on the web side.
                </p>
              </div>
            </Block>

            <Block index="04" title="Two codebases, one product">
              <div className="prose">
                <p>
                  The Huawei build runs in an environment without Google
                  Mobile Services, which means Firebase Messaging,
                  Google-dependent SDKs, and several Google-tied plugins
                  simply aren't available. Rather than ship a half-working
                  Huawei version, I maintain a separate Flutter codebase
                  for Huawei that swaps in HMS-native equivalents,
                  including the Huawei Push Kit (huawei_push) in place of
                  Firebase Messaging.
                </p>
                <p>
                  In practice this means features land in the iOS and
                  Android codebase first, then get ported to the Huawei
                  codebase with the right HMS adaptations. Both codebases
                  need to stay in sync on UX, API integration, and
                  localization so users on every platform get the same
                  tax-filing experience.
                </p>
              </div>
            </Block>

            <Block index="05" title="Technical stack">
              <div className="prose">
                <p>
                  Both codebases are Flutter and Dart. Below is the core
                  stack I work with day-to-day. The Push category is split
                  because the two codebases use different services:
                </p>
              </div>
              <Stagger className="cs-tech" gap={0.05}>
                {techStack.map((group) => (
                  <StaggerItem
                    key={group.group}
                    className="surface cs-tech__group"
                  >
                    <span className="eyebrow eyebrow--plain">
                      {group.group}
                    </span>
                    <div className="chip-row">
                      {group.items.map((item) => (
                        <Chip key={item}>{item}</Chip>
                      ))}
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Block>

            <Block index="06" title="Platform & release">
              <div className="surface cs-facts">
                <dl className="meta-list">
                  {facts.map(([label, value]) => (
                    <React.Fragment key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </div>
            </Block>

            <Block index="07" title="Engineering challenges">
              <div className="prose">
                <p>
                  The interesting work isn't just writing Flutter. It's the
                  cross-platform and production constraints that come with
                  a government-grade app at scale.
                </p>
              </div>
              <ul className="cs-list text-2">
                <li>
                  <strong>Huawei without Google Mobile Services.</strong>
                  {" "}
                  HMS is a parallel ecosystem to GMS. Firebase Messaging,
                  Google Maps, and any Google-dependent plugin needs a
                  Huawei-native replacement (huawei_push for messaging,
                  different geocoding, different in-app purchases). The
                  separate Huawei codebase exists specifically to handle
                  this without compromising the iOS/Android build.
                </li>
                <li>
                  <strong>Solo ownership of the mobile surface.</strong>
                  {" "}
                  Being the only mobile developer on a multi-platform
                  production app means every release, every store
                  submission, every fix routes through one person. Time
                  management and prioritisation matter as much as the
                  code itself.
                </li>
                <li>
                  <strong>
                    Localization aligned with the web platform.
                  </strong>{" "}
                  Mobile localization strings stay consistent with the
                  web platform's Bahasa Malaysia and English copy.
                  Changes to translations go through a shared review
                  process rather than mobile owning them independently.
                </li>
                <li>
                  <strong>Production reliability during filing season.</strong>
                  {" "}
                  Traffic spikes hard in March and April each year. Every
                  regression has user impact at scale, so changes around
                  that window are released cautiously with extra QA
                  cycles.
                </li>
              </ul>
            </Block>

            <Block index="08" title="Press coverage">
              <div className="prose">
                <p>
                  MyTax was covered by BERNAMA in February 2026 when LHDN
                  added e-KYC and digital onboarding for new taxpayers, a
                  feature shipped through the mobile app.
                </p>
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="surface surface--interactive cs-press"
              >
                <span className="cs-press__icon" aria-hidden="true">
                  <FaNewspaper />
                </span>
                <span className="cs-press__body">
                  <span className="mono cs-press__source">
                    {article.publication} ·{" "}
                    <time dateTime={article.date}>
                      {formatMonth(article.date, "en")}
                    </time>
                  </span>
                  <strong className="cs-press__title" lang="ms">
                    {article.titleOriginal}
                  </strong>
                </span>
                <span className="cs-press__arrow" aria-hidden="true">
                  <FiArrowUpRight />
                </span>
              </a>
            </Block>

            <Block index="09" title="What I've learned so far">
              <ul className="cs-list text-2">
                <li>
                  Cross-platform isn't free. Every plugin has to be
                  validated on Huawei, not just iOS and Android, and
                  sometimes the answer is a second codebase rather than
                  a clever runtime check.
                </li>
                <li>
                  Production Flutter at scale rewards careful version
                  pinning and conservative dependency upgrades.
                </li>
                <li>
                  Being the sole mobile developer means owning the
                  boring stuff too: release pipelines, store metadata,
                  and keeping two codebases in sync.
                </li>
                <li>
                  The Android ecosystem is broader than I first thought.
                  Different device makers behave differently under the
                  hood, and that's an area I want to invest more
                  structured testing in as the app evolves.
                </li>
              </ul>
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

export default MyTaxCaseStudy;
