import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaApple, FaGooglePlay, FaArrowLeft, FaNewspaper } from "react-icons/fa";
import { SiHuawei } from "react-icons/si";
import { HiOutlineExternalLink } from "react-icons/hi";
import Particle from "./Particle";
import FadeIn from "./FadeIn";
import usePageMeta from "../hooks/usePageMeta";
import shot1 from "../Assets/featured/pic 1.jpeg";
import shot2 from "../Assets/featured/pic 2.jpeg";
import shot3 from "../Assets/featured/pic 3.jpeg";

const screenshots = [shot1, shot2, shot3];

const storeLinks = [
  {
    Icon: FaApple,
    label: "App Store",
    url: "https://apps.apple.com/my/app/mytax/id1632195676",
  },
  {
    Icon: FaGooglePlay,
    label: "Google Play",
    url: "https://play.google.com/store/apps/details?id=com.lhdn.mytax",
  },
  {
    Icon: SiHuawei,
    label: "AppGallery",
    url: "https://appgallery.cloud.huawei.com/ag/n/app/C106575285",
  },
];

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

function MyTaxCaseStudy() {
  usePageMeta({
    title: "MyTax Case Study, Zariff Danial",
    description:
      "Engineering case study on the MyTax mobile app, Malaysia's official tax filing application maintained by Zariff Danial at Zen Computer Systems and deployed across iOS, Android, and Huawei AppGallery.",
  });

  return (
    <Container fluid className="case-study-section">
      <Particle />
      <Container>
        <FadeIn>
          <Link to="/about" className="case-study-back">
            <FaArrowLeft aria-hidden="true" /> Back to About
          </Link>
        </FadeIn>

        <FadeIn>
          <header className="case-study-hero">
            <span className="case-study-tag">Case Study · Production Work</span>
            <h1 className="case-study-title">MyTax</h1>
            <p className="case-study-tagline">
              Malaysia's official income tax filing app, used by taxpayers
              nationwide. Maintained at Zen Computer Systems for the Inland
              Revenue Board (LHDN), live across three mobile ecosystems.
            </p>
            <div className="case-study-meta">
              <span><strong>Client</strong> · LHDN Malaysia</span>
              <span><strong>Company</strong> · Zen Computer Systems</span>
              <span><strong>Role</strong> · Sole Mobile Developer</span>
              <span><strong>Period</strong> · Nov 2025 to Present</span>
            </div>
            <div className="case-study-store-links">
              {storeLinks.map(({ Icon, label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="store-link"
                >
                  <Icon aria-hidden="true" />
                  <span>
                    <small>Available on</small>
                    <strong>{label}</strong>
                  </span>
                </a>
              ))}
            </div>
          </header>
        </FadeIn>

        <FadeIn>
          <section className="case-study-screenshots">
            {screenshots.map((src, i) => (
              <div key={i} className="case-study-screenshot">
                <img
                  src={src}
                  alt={`MyTax mobile app screenshot ${i + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </section>
        </FadeIn>

        <Row className="case-study-body">
          <Col lg={8} className="mx-auto">
            <FadeIn>
              <section className="case-study-block">
                <h2>Overview</h2>
                <p>
                  MyTax is the official mobile companion to the LHDN tax
                  filing platform. It lets Malaysian taxpayers file returns,
                  view payment and refund history, manage authentication,
                  and access tax services from their phone. The app ships to
                  three distinct mobile ecosystems: iOS via the Apple App
                  Store, Android via Google Play, and Huawei devices via
                  Huawei AppGallery. It has been in continuous production
                  since 2022 and is currently on version 1.0.48 (build 69).
                </p>
              </section>
            </FadeIn>

            <FadeIn>
              <section className="case-study-block">
                <h2>My role</h2>
                <p>
                  I'm the sole mobile developer on MyTax. The rest of the
                  engineering team focuses on the web platform, so anything
                  that ships to phones runs through me. I own mobile
                  end-to-end: bug fixes, releases, platform-specific
                  adaptations, localization, and feature shipping across
                  iOS, Android, and Huawei builds.
                </p>
                <p>
                  In practice, in any given week I might be tracing an
                  Android-OEM-specific crash, adapting a feature to work
                  under Huawei Mobile Services (which has no Google Mobile
                  Services available), keeping Bahasa Malaysia and English
                  strings aligned with the web platform's copy, or
                  integrating a new API endpoint the backend team has just
                  shipped on the web side.
                </p>
              </section>
            </FadeIn>

            <FadeIn>
              <section className="case-study-block">
                <h2>Two codebases, one product</h2>
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
              </section>
            </FadeIn>

            <FadeIn>
              <section className="case-study-block">
                <h2>Technical stack</h2>
                <p>
                  Both codebases are Flutter and Dart. Below is the core
                  stack I work with day-to-day. The Push category is split
                  because the two codebases use different services:
                </p>
                <div className="case-study-tech-grid">
                  {techStack.map((group) => (
                    <div key={group.group} className="case-study-tech-group">
                      <h4>{group.group}</h4>
                      <ul>
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </FadeIn>

            <FadeIn>
              <section className="case-study-block">
                <h2>Engineering challenges</h2>
                <p className="case-study-block-intro">
                  The interesting work isn't just writing Flutter. It's the
                  cross-platform and production constraints that come with
                  a government-grade app at scale.
                </p>
                <ul className="case-study-challenges">
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
                    <strong>Android OEM fragmentation.</strong> Samsung,
                    Xiaomi, Oppo, Vivo, Realme, and stock Android all run
                    customised versions of Android with different
                    permission systems, different battery-optimisation
                    rules, and different notification handling. A crash
                    that only happens on a specific OEM's Android 13 is
                    its own debugging rabbit hole.
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
              </section>
            </FadeIn>

            <FadeIn>
              <section className="case-study-block">
                <h2>Press coverage</h2>
                <p>
                  MyTax was covered by BERNAMA in February 2026 when LHDN
                  added e-KYC and digital onboarding for new taxpayers, a
                  feature shipped through the mobile app.
                </p>
                <a
                  href="https://bernama.com/bm/news.php?id=2522325"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="case-study-press-link"
                >
                  <FaNewspaper aria-hidden="true" />
                  <span>
                    <small>BERNAMA · February 2026</small>
                    <strong>
                      Portal MyTax LHDN Sedia Kaedah e-KYC, e-CP55D Bagi
                      Pembayar Cukai Baharu
                    </strong>
                  </span>
                  <HiOutlineExternalLink aria-hidden="true" />
                </a>
              </section>
            </FadeIn>

            <FadeIn>
              <section className="case-study-block">
                <h2>What I've learned so far</h2>
                <ul className="case-study-takeaways">
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
                    Debugging is half the job. Reproducing an OEM-specific
                    bug on a device you don't physically own is its own
                    skill.
                  </li>
                  <li>
                    Being the sole mobile developer means owning the
                    boring stuff too: release pipelines, store metadata,
                    crash triage, and keeping two codebases in sync.
                  </li>
                </ul>
              </section>
            </FadeIn>

            <FadeIn>
              <Link to="/about" className="case-study-back case-study-back-bottom">
                <FaArrowLeft aria-hidden="true" /> Back to About
              </Link>
            </FadeIn>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default MyTaxCaseStudy;
