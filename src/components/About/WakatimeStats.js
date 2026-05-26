import React, { useState } from "react";
import { Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import FadeIn from "../FadeIn";

// Wakatime "Embeddable Charts" share URL. Generate one at:
//   https://wakatime.com/share → Embeddable Charts → Add New
// then paste the .svg URL below. Set to empty string to hide the widget.
const WAKATIME_SHARE_URL =
  "https://wakatime.com/share/@Zariffdn/fc72fa5a-228b-44b0-bd37-6370c72b9302.svg";

function WakatimeStats() {
  const { t } = useTranslation();
  const [hasError, setHasError] = useState(false);

  if (!WAKATIME_SHARE_URL || hasError) return null;

  return (
    <FadeIn>
      <h1 className="project-heading">
        {t("wakatime.headingPre")}{" "}
        <strong className="purple">{t("wakatime.headingHighlight")}</strong>
      </h1>
      <Row style={{ justifyContent: "center", paddingBottom: "30px" }}>
        <img
          src={WAKATIME_SHARE_URL}
          alt={t("wakatime.alt")}
          className="wakatime-chart"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      </Row>
    </FadeIn>
  );
}

export default WakatimeStats;
