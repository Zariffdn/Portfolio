import React from "react";
import { Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { SiHuawei } from "react-icons/si";

const keys = [
  {
    key: "zen",
    bullets: ["b1", "b2", "b3", "b4"],
    links: [
      {
        kind: "appstore",
        url: "https://apps.apple.com/my/app/mytax/id1632195676",
        count: "1.7M+ installs",
      },
      {
        kind: "playstore",
        url: "https://play.google.com/store/apps/details?id=com.lhdn.mytax",
        count: "894K+ installs",
      },
      {
        kind: "appgallery",
        url: "https://appgallery.cloud.huawei.com/ag/n/app/C106575285",
        count: "282K+ installs",
      },
    ],
  },
  { key: "bestinet", bullets: ["b1", "b2", "b3", "b4"], links: [] },
];

function StoreLinks({ links }) {
  const { t } = useTranslation();
  if (!links || links.length === 0) return null;

  return (
    <div className="store-links">
      <span className="store-links-label">{t("about.availableOn")}</span>
      <div className="store-links-row">
        {links.map((link) => {
          if (link.kind === "appstore") {
            return (
              <a
                key="appstore"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="store-link"
                aria-label="Download on the App Store"
              >
                <FaApple aria-hidden="true" />
                <span>
                  <small>Download on the</small>
                  <strong>App Store</strong>
                </span>
                {link.count && (
                  <span className="store-link-count" aria-label={link.count}>
                    {link.count}
                  </span>
                )}
              </a>
            );
          }
          if (link.kind === "playstore") {
            return (
              <a
                key="playstore"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="store-link"
                aria-label="Get it on Google Play"
              >
                <FaGooglePlay aria-hidden="true" />
                <span>
                  <small>Get it on</small>
                  <strong>Google Play</strong>
                </span>
                {link.count && (
                  <span className="store-link-count" aria-label={link.count}>
                    {link.count}
                  </span>
                )}
              </a>
            );
          }
          if (link.kind === "appgallery") {
            return (
              <a
                key="appgallery"
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="store-link"
                aria-label="Explore it on AppGallery"
              >
                <SiHuawei aria-hidden="true" />
                <span>
                  <small>Explore it on</small>
                  <strong>AppGallery</strong>
                </span>
                {link.count && (
                  <span className="store-link-count" aria-label={link.count}>
                    {link.count}
                  </span>
                )}
              </a>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

function Experience() {
  const { t } = useTranslation();
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "30px" }}>
      <ul className="timeline-list">
        {keys.map(({ key, bullets, links }) => (
          <li key={key} className="timeline-item">
            <div className="timeline-period">{t(`experience.${key}.period`)}</div>
            <div className="timeline-role">{t(`experience.${key}.role`)}</div>
            <div className="timeline-company">{t(`experience.${key}.company`)}</div>
            <div className="timeline-meta">{t(`experience.${key}.meta`)}</div>
            <ul className="timeline-bullets">
              {bullets.map((b) => (
                <li key={b}>{t(`experience.${key}.${b}`)}</li>
              ))}
            </ul>
            <StoreLinks links={links} />
          </li>
        ))}
      </ul>
    </Row>
  );
}

export default Experience;
