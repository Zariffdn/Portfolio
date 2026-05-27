import React from "react";
import GitHubCalendar from "react-github-calendar";
import { Row } from "react-bootstrap";
import { useTheme } from "../../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

const darkPalette = {
  level0: "rgba(255, 255, 255, 0.06)",
  level1: "#3a1d5c",
  level2: "#6f1ba8",
  level3: "#9a3fd1",
  level4: "#c770f0",
};

const lightPalette = {
  level0: "rgba(122, 47, 175, 0.1)",
  level1: "#d4b5f0",
  level2: "#a86fc9",
  level3: "#7e3ba5",
  level4: "#4a0d7e",
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
