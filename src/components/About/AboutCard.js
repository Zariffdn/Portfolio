import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Zariff Danial </span>
            from <span className="purple"> Selangor, Malaysia.</span>
            <br /> I am a Graduate in BACHELOR OF COMPUTER SCIENCE (HONS.) NETCENTRIC COMPUTING
            <br />
            <br />
            I'm currently a <span className="purple">Mobile Developer</span> at
            <span className="purple"> Zen Computer System</span> (since November
            2025), focused on bug fixing and technical support for Flutter
            applications. Previously at
            <span className="purple"> Bestinet Sdn Bhd</span> as a Mobile
            Developer (June to November 2025), where I built new UI features.
            <br />
            <br />
            Apart from coding, some other activities that I love to do!
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Playing Games
            </li>
            <li className="about-activity">
              <ImPointRight /> Working Out
            </li>
            <li className="about-activity">
              <ImPointRight /> Listening To Music
            </li>
          </ul>

          <p style={{ color: "var(--quote-text)" }}>
            "Turning ideas into executable magic!"{" "}
          </p>
          <footer className="blockquote-footer">Zariff</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
