import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Hadeer Hesham </span>
            from <span className="purple"> Alexandria, Egypt.</span>
            <br />
            I am currently employed as a software engineer at Spiritude.
            <br />
            I completed an Integrated Bachelor of Science (B.Sc.) degree at
            Alexandria University.
            <br />
            <br />
            When I'm not coding, here are a few activities I love to engage in:
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Solving Puzzles 🧩
            </li>
            <li className="about-activity">
              <ImPointRight /> Reading about Psychology, Self-Development, and
              Business 📚
            </li>
            <li className="about-activity">
              <ImPointRight /> Meditating 🧘‍♀️
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "You are only as strong as your daily routine!"{" "}
          </p>
          <footer className="blockquote-footer">Hadeer</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
