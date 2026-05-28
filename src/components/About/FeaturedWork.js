import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { SiHuawei } from "react-icons/si";
import { HiSparkles } from "react-icons/hi";
import { HiArrowRight } from "react-icons/hi";
import FadeIn from "../FadeIn";
import shot1 from "../../Assets/featured/pic 1.jpeg";
import shot2 from "../../Assets/featured/pic 2.jpeg";
import shot3 from "../../Assets/featured/pic 3.jpeg";

const screenshots = [shot1, shot2, shot3];

const links = [
  {
    kind: "appstore",
    url: "https://apps.apple.com/my/app/mytax/id1632195676",
    small: "Download on the",
    big: "App Store",
    Icon: FaApple,
    aria: "Download MyTax on the App Store",
  },
  {
    kind: "playstore",
    url: "https://play.google.com/store/apps/details?id=com.lhdn.mytax",
    small: "Get it on",
    big: "Google Play",
    Icon: FaGooglePlay,
    aria: "Get MyTax on Google Play",
  },
  {
    kind: "appgallery",
    url: "https://appgallery.cloud.huawei.com/ag/n/app/C106575285",
    small: "Explore it on",
    big: "AppGallery",
    Icon: SiHuawei,
    aria: "Explore MyTax on AppGallery",
  },
];

function FeaturedWork() {
  const { t } = useTranslation();

  return (
    <FadeIn>
      <article className="featured-work">
        <div className="featured-work-label">
          <HiSparkles aria-hidden="true" /> {t("about.featuredLabel")}
        </div>
        <h2 className="featured-work-title">{t("about.featuredTitle")}</h2>
        <p className="featured-work-subtitle">
          {t("about.featuredSubtitle")}
        </p>
        <p className="featured-work-description">
          {t("about.featuredDescription")}
        </p>

        <div className="featured-work-screenshots">
          {screenshots.map((src, i) => (
            <div className="featured-work-screenshot" key={i}>
              <img
                src={src}
                alt={`MyTax mobile app screenshot ${i + 1}`}
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="featured-work-stats">
          {[1, 2, 3].map((n) => (
            <div className="featured-work-stat" key={n}>
              <div className="featured-work-stat-value">
                {t(`about.featuredStat${n}Value`)}
              </div>
              <div className="featured-work-stat-label">
                {t(`about.featuredStat${n}Label`)}
              </div>
            </div>
          ))}
        </div>

        <div className="featured-work-links">
          {links.map(({ kind, url, small, big, Icon, aria }) => (
            <a
              key={kind}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="store-link featured-store-link"
              aria-label={aria}
            >
              <Icon aria-hidden="true" />
              <span>
                <small>{small}</small>
                <strong>{big}</strong>
              </span>
            </a>
          ))}
        </div>

        <Link to="/mytax" className="featured-work-case-study">
          {t("about.readCaseStudy")}
          <HiArrowRight aria-hidden="true" />
        </Link>
      </article>
    </FadeIn>
  );
}

export default FeaturedWork;
