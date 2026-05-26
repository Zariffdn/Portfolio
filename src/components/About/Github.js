import React from "react";
import GitHubCalendar from "react-github-calendar";
import { Row } from "react-bootstrap";
import { useTheme } from "../../contexts/ThemeContext";

function Github() {
  const { theme } = useTheme();
  const calendarColor = theme === "light" ? "#6f1ba8" : "#c770f0";

  return (
    <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
      <h1 className="project-heading" style={{ paddingBottom: "20px" }}>
        Days I <strong className="purple">Code</strong>
      </h1>
      <div style={{ color: "var(--text-primary)" }}>
        <GitHubCalendar
          username="Zariffdn"
          blockSize={15}
          blockMargin={5}
          color={calendarColor}
          colorScheme={theme}
          fontSize={16}
        />
      </div>
    </Row>
  );
}

export default Github;
