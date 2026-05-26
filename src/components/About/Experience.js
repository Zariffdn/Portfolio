import React from "react";
import { Row } from "react-bootstrap";

const experiences = [
  {
    role: "Solutions Developer (Mobile App Developer)",
    company: "Zen Computer Systems",
    period: "November 2025 to Present",
    meta: "Cyberjaya, Selangor · On-site · Contract",
    bullets: [
      "Responsible for maintaining and supporting the MyTax mobile application under LHDN.",
      "Troubleshoot, debug, and resolve technical issues to ensure smooth app performance.",
      "Implement fixes, updates, and improvements independently from end to end.",
      "Ensure app stability, reliability, and a seamless user experience.",
    ],
  },
  {
    role: "Mobile Application Developer",
    company: "Bestinet Sdn Bhd",
    period: "July 2025 to November 2025",
    meta: "Cyberjaya, Selangor · Hybrid · Contract",
    bullets: [
      "Assigned to enhance login security by developing a mobile TOTP Authenticator app.",
      "Built the front-end with Flutter and collaborated with the backend team for smooth API integration.",
      "Optimized performance and resolved bugs to improve responsiveness.",
      "Improved authentication speed by 40% and user satisfaction by 25%.",
    ],
  },
];

function Experience() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "30px" }}>
      <ul className="experience-timeline">
        {experiences.map((exp) => (
          <li key={exp.company} className="experience-item">
            <div className="experience-period">{exp.period}</div>
            <div className="experience-role">{exp.role}</div>
            <div className="experience-company">{exp.company}</div>
            <div className="experience-meta">{exp.meta}</div>
            <ul className="experience-bullets">
              {exp.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Row>
  );
}

export default Experience;
