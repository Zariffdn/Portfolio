import React from "react";
import { Col, Row } from "react-bootstrap";
import { CgCPlusPlus } from "react-icons/cg";
import {
  DiJavascript1,
  DiReact,
  DiNodejs,
  DiCode,
  DiPython,
  DiGit,
  DiJava,
} from "react-icons/di";
import {
  SiFirebase,
  SiBootstrap,
  SiFlutter,
  SiDart,
} from "react-icons/si";
import { FaDatabase, FaPhp } from "react-icons/fa";

const techs = [
  { name: "Flutter", Icon: SiFlutter },
  { name: "Dart", Icon: SiDart },
  { name: "C++", Icon: CgCPlusPlus },
  { name: "JavaScript", Icon: DiJavascript1 },
  { name: "Node.js", Icon: DiNodejs },
  { name: "React", Icon: DiReact },
  { name: "Code", Icon: DiCode },
  { name: "PHP", Icon: FaPhp },
  { name: "MySQL", Icon: FaDatabase },
  { name: "Git", Icon: DiGit },
  { name: "Firebase", Icon: SiFirebase },
  { name: "Bootstrap", Icon: SiBootstrap },
  { name: "Python", Icon: DiPython },
  { name: "Java", Icon: DiJava },
];

function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      {techs.map(({ name, Icon }) => (
        <Col
          xs={4}
          md={2}
          className="tech-icons"
          key={name}
          tabIndex={0}
          aria-label={name}
        >
          <Icon />
          <span className="icon-tooltip" role="tooltip">{name}</span>
        </Col>
      ))}
    </Row>
  );
}

export default Techstack;
