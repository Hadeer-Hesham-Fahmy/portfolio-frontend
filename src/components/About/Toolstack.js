import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  SiVisualstudiocode,
  SiPostman,
  SiSlack,
  SiMacos,
  SiDocker,
  SiSocketdotio,
  SiGithub,
  SiGitlab,
  SiLinux,
  SiWindows,
  SiJenkins,
  SiJest,
} from "react-icons/si";

function Toolstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className="tech-icons">
        <SiMacos />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiLinux />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiWindows />
      </Col>

      <Col xs={4} md={2} className="tech-icons">
        <SiVisualstudiocode />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiPostman />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiSlack />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiDocker />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiSocketdotio />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiGithub /> {/* GitHub Icon */}
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiGitlab /> {/* GitHub Icon */}
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiJenkins /> {/* GitHub Icon */}
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiJest /> {/* GitHub Icon */}
      </Col>
    </Row>
  );
}

export default Toolstack;
