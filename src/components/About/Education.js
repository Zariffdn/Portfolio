import React from "react";
import { Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const items = [
  { key: "peoplelogy", bullets: ["b1", "b2"] },
  { key: "uitm", bullets: [] },
  { key: "matrikulasi", bullets: [] },
];

function Education() {
  const { t } = useTranslation();
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "30px" }}>
      <ul className="timeline-list">
        {items.map(({ key, bullets }) => (
          <li key={key} className="timeline-item">
            <div className="timeline-period">{t(`education.${key}.period`)}</div>
            <div className="timeline-role">{t(`education.${key}.role`)}</div>
            <div className="timeline-company">{t(`education.${key}.company`)}</div>
            <div className="timeline-meta">{t(`education.${key}.meta`)}</div>
            {bullets.length > 0 && (
              <ul className="timeline-bullets">
                {bullets.map((b) => (
                  <li key={b}>{t(`education.${key}.${b}`)}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </Row>
  );
}

export default Education;
