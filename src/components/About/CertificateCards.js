import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function CertificateCard(props) {
  return (
    <Card
      className="project-card-view"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Card.Img variant="top" src={props.imgPath} alt="card-img" />
      <Card.Body
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Card.Title>{props.title}</Card.Title>
          <Card.Text style={{ textAlign: "left" }}>
            {props.description}
          </Card.Text>
        </div>
        <Button variant="primary" href={props.ghLink} target="_blank">
          Show credential
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CertificateCard;
