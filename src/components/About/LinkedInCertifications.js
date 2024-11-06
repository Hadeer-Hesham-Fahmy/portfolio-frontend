import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import CertificateCard from "./CertificateCards";

function LinkedInCertifications() {
  const certifications = [
    {
      title: "Back End Development and APIs",
      issuer: "Free Code Camp",
      link: "https://freecodecamp.org/certification/Hadeer_Hesham_Fahmy/back-end-development-and-apis",
      image: require("../../Assets/certificates/BackendDevelopmentAndApisFreeCodeCampCert.png"), // Replace with the actual image URL if available
    },
    {
      title: "Laravel framework with APIs",
      issuer: "New Horizons Centers",
      link: "https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2IvcyFBbHRNVGVPOFpwZUlnV2lva0h3N3dhU3JSYTdk&cid=889766BCE34D4C5B&id=889766BCE34D4C5B%21232&parId=889766BCE34D4C5B%21106&o=OneUp",
      image: require("../../Assets/certificates/LaravelFrameworkandApisNewHorizonsCenters.png"), // Replace with the actual image URL if available
    },
    {
      title: "Building web applications using PHP & MYSQL",
      issuer: "Information Technology Institute Platform",
      link: "https://drive.google.com/file/d/1ayIzN7MGCI2hTJgpJ_fRK1J726NMb8N8/view",
      image: require("../../Assets/certificates/BuildingWebApplicationsUsingPHP&MYSQLITI.png"), // Replace with the actual image URL if available
    },
    {
      title: "MongoDB",
      issuer: "MongoDB Platform",
      link: "https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL3UvcyFBbHRNVGVPOFpwZUlnVVppOEZuZmxpTnQ0LXdL&cid=889766BCE34D4C5B&id=889766BCE34D4C5B%21198&parId=889766BCE34D4C5B%21173&o=OneUp",
      image: require("../../Assets/certificates/MongoDB.png"), // Replace with the actual image URL if available
    },
    {
      title: "JS",
      issuer: "ITI Platform",
      link: "https://drive.google.com/file/d/1arWiaW8whp32R2S19dhVmZyugp4UnLxf/view",
      image: require("../../Assets/certificates/JSITI.png"), // Replace with the actual image URL if available
    },
    {
      title: "PHP",
      issuer: "New Horizons Centers",
      link: "https://drive.google.com/file/d/1FeQI0q1FCMn6kTC3Qzq--V3k8XU3WfK5/view",
      image: require("../../Assets/certificates/PHP New Horizons Centers .jpg"), // Replace with the actual image URL if available
    },
    {
      title: "MySQL",
      issuer: "New Horizons Centers",
      link: "https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2IvcyFBbHRNVGVPOFpwZUlnU1BWQVk0akRvQ3I1dWZ5&cid=889766BCE34D4C5B&id=889766BCE34D4C5B%21163&parId=root&o=OneUp",
      image: require("../../Assets/certificates/MySQLNewHorizonsCenters.png"), // Replace with the actual image URL if available
    },
    {
      title: "API Design",
      issuer: "API academy",
      link: "https://www.linkedin.com/posts/hadeer-hesham-fahmy-45bb671b8_api-academy-certification-activity-7141471978791636992-fvvN?utm_source=share&utm_medium=member_desktop",
      image: require("../../Assets/certificates/APIDesignerApiAcademy.png"), // Replace with the actual image URL if available
    },
    {
      title: "Web development challenger track",
      issuer: "Ministry of Communication and Information Technology",
      link: "https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2IvcyFBbHRNVGVPOFpwZUlnUjM4QUpGWll3WjdoMHh0&cid=889766BCE34D4C5B&id=889766BCE34D4C5B%21157&parId=889766BCE34D4C5B%21106&o=OneUp",
      image: require("../../Assets/certificates/WebDevelopmentChallengerTrackMCIT.png"), // Replace with the actual image URL if available
    },
    // Add more certifications as needed
  ];

  return (
    <Row
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        paddingBottom: "10px",
      }}
    >
      <h1 className="project-heading" style={{ paddingBottom: "20px" }}>
        My <strong className="purple">Key Certifications</strong>
      </h1>
      <ul
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          textAlign: "left",
          listStyleType: "none",
          padding: 0,
        }}
      >
        {certifications.map((cert, index) => (
          <Col md={4} className="project-card">
            <CertificateCard
              imgPath={cert.image}
              title={cert.title}
              description={cert.issuer}
              ghLink={cert.link}
            />
          </Col>
        ))}
      </ul>
      <h1
        className="project-heading"
        style={{ paddingBottom: "20px", paddingTop: "20px" }}
      >
        Journey Through <strong className="purple">DevOps</strong>
      </h1>
      <ul
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          textAlign: "left",
          listStyleType: "none",
          padding: 0,
        }}
      >
        <div style={{ position: "relative", width: "504px", height: "2328px" }}>
          <iframe
            src="https://www.linkedin.com/embed/feed/update/urn:li:share:7131990338927247361"
            height="2328"
            width="504"
            frameborder="0"
            allowfullscreen=""
            title="Embedded post"
            style={{ pointerEvents: "none" }}
          ></iframe>
          <a
            href="https://www.linkedin.com/embed/feed/update/urn:li:share:7131990338927247361"
            target="_blank"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
            }}
          ></a>
        </div>
      </ul>
    </Row>
  );
}

export default LinkedInCertifications;
