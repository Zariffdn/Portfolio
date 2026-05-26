import React from "react";
import { Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const keys = [
  { key: "zen", bullets: ["b1", "b2", "b3", "b4"] },
  { key: "bestinet", bullets: ["b1", "b2", "b3", "b4"] },
];

function Experience() {
  const { t } = useTranslation();
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "30px" }}>
      <ul className="timeline-list">
        {keys.map(({ key, bullets }) => (
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
          </li>
        ))}
      </ul>
    </Row>
  );
}

export default Experience;
