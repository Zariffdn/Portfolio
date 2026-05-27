import React from "react";
import GitHubCalendar from "react-github-calendar";
import { Row } from "react-bootstrap";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

const darkPalette = {
  level0: "rgba(255, 255, 255, 0.06)",
  level1: "#1e3a5f",
  level2: "#1d4ed8",
  level3: "#2563eb",
  level4: "#3794ff",
};

const lightPalette = {
  level0: "rgba(0, 102, 204, 0.1)",
  level1: "#bfdbfe",
  level2: "#60a5fa",
  level3: "#1d4ed8",
  level4: "#0066cc",
};

function Github() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const palette = theme === "light" ? lightPalette : darkPalette;

  return (
    <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
      <h1 className="project-heading" style={{ paddingBottom: "20px" }}>
        {t("about.daysICodePre")}{" "}
        <strong className="purple">{t("about.daysICodeHighlight")}</strong>
      </h1>
      <div
        style={{
          color: "var(--text-primary)",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <GitHubCalendar
          username="Zariffdn"
          blockSize={15}
          blockMargin={5}
          theme={palette}
          fontSize={16}
        />
      </div>
    </Row>
  );
}

export default Github;
