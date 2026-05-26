import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  SiVisualstudiocode,
  SiArduino,
  SiAndroidstudio,
  SiNpm,
  SiGithub,
  SiGradle,
  SiPostman,
} from "react-icons/si";

const tools = [
  { name: "VS Code", Icon: SiVisualstudiocode },
  { name: "npm", Icon: SiNpm },
  { name: "GitHub", Icon: SiGithub },
  { name: "Gradle", Icon: SiGradle },
  { name: "Android Studio", Icon: SiAndroidstudio },
  { name: "Arduino", Icon: SiArduino },
  { name: "Postman", Icon: SiPostman },
];

function Toolstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      {tools.map(({ name, Icon }) => (
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

export default Toolstack;
