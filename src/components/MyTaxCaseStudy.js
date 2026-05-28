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
    group: "Push & Notifications",
    items: [
      "Firebase Messaging",
      "Flutter Local Notifications",
      "Overlay Support",
    ],
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
    title: "MyTax Case Study — Zariff Danial",
    description:
      "Engineering case study on the MyTax mobile app — Malaysia's official tax filing application maintained by Zariff Danial at Zen Computer Systems, deployed across iOS, Android, and Huawei AppGallery.",
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
              <span><strong>Role</strong> · Solutions Developer (Mobile)</span>
              <span><strong>Period</strong> · Nov 2025 – Present</span>
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
                  and access tax-related services from their phone. The app
                  ships to three distinct mobile ecosystems — iOS via the
                  Apple App Store, Android via Google Play, and Huawei
                  devices via Huawei AppGallery — and has been in
                  continuous production since 2022, currently on version
                  1.0.48 (build 69).
                </p>
              </section>
            </FadeIn>

            <FadeIn>
              <section className="case-study-block">
                <h2>My role</h2>
                <p>
                  I joined the mobile team in November 2025 as a Solutions
                  Developer focused on production stability and feature
                  parity across all three platforms. I do not own the
                  product roadmap or backend architecture — I work
                  alongside backend engineers and other mobile developers
                  to ship updates, debug platform-specific issues, and
                  keep the app reliable for end users.
                </p>
                <p>
                  Concretely, in any given week I might be: tracing an
                  Android-OEM-specific crash, adapting a feature to work
                  under Huawei Mobile Services (which doesn't have Google
                  Mobile Services available), updating Bahasa Malaysia
                  localization strings to align with the web platform,
                  or integrating a new API endpoint the backend team
                  has just shipped.
                </p>
              </section>
            </FadeIn>

            <FadeIn>
              <section className="case-study-block">
                <h2>Technical stack</h2>
                <p>
                  The app is a single Flutter codebase running across
                  iOS, Android, and Huawei. Below is the core stack I work
                  with day-to-day:
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
                  The interesting work isn't just writing Flutter — it's the
                  cross-platform and production constraints that come with a
                  government-grade app at scale.
                </p>
                <ul className="case-study-challenges">
                  <li>
                    <strong>Huawei without Google Mobile Services.</strong>
                    {" "}
                    The Huawei AppGallery build runs in an environment where
                    Google Mobile Services aren't available. That means
                    Firebase, Google Maps, and any Google-dependent plugin
                    needs an HMS fallback or an alternative implementation.
                    Every release has to be validated against the Huawei
                    build path separately.
                  </li>
                  <li>
                    <strong>Android OEM fragmentation.</strong> Samsung,
                    Xiaomi, Oppo, Vivo, Huawei, and stock Android all
                    behave differently around permissions, background
                    services, and notifications. A crash that only happens
                    on one OEM's Android 12 build is its own debugging
                    rabbit hole.
                  </li>
                  <li>
                    <strong>Localization aligned with the web platform.</strong>
                    {" "}
                    Mobile localization strings have to stay consistent with
                    the existing web platform's Bahasa Malaysia and English
                    copy, so changes go through a shared review process
                    rather than mobile owning the translations independently.
                  </li>
                  <li>
                    <strong>Production reliability for a tax app.</strong>
                    {" "}
                    The app sees the heaviest traffic during filing season
                    (Mar–Apr each year). Every regression has user impact at
                    scale, so changes are released cautiously with extra QA
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
                  added e-KYC and digital onboarding for new taxpayers — a
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
                    Cross-platform isn't free — every plugin needs to be
                    validated on Huawei, not just iOS and Android.
                  </li>
                  <li>
                    Production Flutter at scale rewards careful version
                    pinning and conservative dependency upgrades.
                  </li>
                  <li>
                    Debugging is half the job. Reproducing an OEM-specific
                    bug on a device you don't own is its own skill.
                  </li>
                  <li>
                    Localization is engineering work too — string keys,
                    pluralization, and review workflows all matter.
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
