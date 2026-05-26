import React from "react";
import { Row } from "react-bootstrap";

const education = [
  {
    role: "Data Science Analyst Bootcamp Programme",
    company: "PEOPLElogy Group",
    period: "March 2024 to August 2024",
    meta: "Data Science",
    bullets: [
      "Capstone project: movie genre prediction from plot summaries.",
      "Covered Python programming, data wrangling, exploratory data analysis, machine learning, and natural language processing.",
    ],
  },
  {
    role: "Bachelor of Computer Science (Hons.) Netcentric Computing",
    company: "Universiti Teknologi MARA (UiTM)",
    period: "October 2020 to September 2023",
    meta: "CGPA: 3.32",
    bullets: [],
  },
  {
    role: "Module 2, Physical Sciences",
    company: "Kolej Matrikulasi Selangor",
    period: "May 2019 to March 2020",
    meta: "CGPA: 3.04",
    bullets: [],
  },
];

function Education() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "30px" }}>
      <ul className="timeline-list">
        {education.map((item) => (
          <li key={item.company} className="timeline-item">
            <div className="timeline-period">{item.period}</div>
            <div className="timeline-role">{item.role}</div>
            <div className="timeline-company">{item.company}</div>
            <div className="timeline-meta">{item.meta}</div>
            {item.bullets.length > 0 && (
              <ul className="timeline-bullets">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
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
