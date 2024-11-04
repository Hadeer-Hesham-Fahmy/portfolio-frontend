import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";

function ProjectCards(props) {
  return (
    <Card className="project-card-view">
      <Card.Img variant="top" src={props.imgPath} alt="card-img" />
      <Card.Body
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          justifyContent: "space-between",
        }}
      >
        <Card.Title>{props.title}</Card.Title>
        <Card.Text style={{ textAlign: "left" }}>{props.description}</Card.Text>

        <div>
          {props.urls &&
            props.urls.length > 0 &&
            props.urls.map((url, index) => (
              <Button
                key={index}
                variant="primary"
                href={url}
                target="_blank"
                style={{ marginLeft: "10px", marginBottom: "5px" }}
              >
                Visit Link {index + 1}
              </Button>
            ))}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProjectCards;
