import React from "react";
import { Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";
import FadeIn from "../FadeIn";

// To enable this widget:
//   1. Sign up at https://wakatime.com (free)
//   2. Install the Wakatime plugin in your editor (Android Studio, VS Code, etc.)
//   3. Settings → Profile → make profile public
//   4. Put your Wakatime username below
//   5. Code for a few days so stats accumulate
const WAKATIME_USERNAME = "Zariffdn";

function WakatimeStats() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  if (!WAKATIME_USERNAME) return null;

  const params = new URLSearchParams({
    username: WAKATIME_USERNAME,
    layout: "compact",
    hide_border: "true",
    bg_color: "00000000",
    title_color: "c770f0",
    text_color: theme === "light" ? "1a1429" : "ffffff",
    icon_color: "c770f0",
    custom_title: t("wakatime.cardTitle"),
  });

  const cardUrl = `https://github-readme-stats.vercel.app/api/wakatime?${params.toString()}`;

  return (
    <FadeIn>
      <h1 className="project-heading">
        {t("wakatime.headingPre")}{" "}
        <strong className="purple">{t("wakatime.headingHighlight")}</strong>
      </h1>
      <Row style={{ justifyContent: "center", paddingBottom: "30px" }}>
        <img
          src={cardUrl}
          alt={t("wakatime.alt")}
          style={{ maxWidth: "500px", width: "100%", height: "auto" }}
          loading="lazy"
        />
      </Row>
    </FadeIn>
  );
}

export default WakatimeStats;
