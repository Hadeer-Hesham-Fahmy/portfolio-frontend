import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import Home2 from "./Home2";
import Type from "./Type";
import CarModel from "../Animation/Car";
import backgroundVideo from '../../Assets/my-photo.mp4';
import nameGif from '../../Assets/hadeer.gif';
import nameImage from '../../Assets/hadeer.png';

function Home() {
  const [isNameGifVisible, setIsNameGifVisible] = useState(false);
  const [isNameImageVisible, setIsNameImageVisible] = useState(false);

  // Change the background image after specific intervals
  useEffect(() => {
    const gifTimer = setTimeout(() => setIsNameGifVisible(true), 7500);
    const imageTimer = setTimeout(() => setIsNameImageVisible(true), 11750);

    return () => {
      clearTimeout(gifTimer);
      clearTimeout(imageTimer);
    };
  }, []);

  const nameBackgroundImage = isNameGifVisible && !isNameImageVisible 
    ? nameGif 
    : isNameImageVisible 
      ? nameImage 
      : "none";

  return (
    <section id="home">
      <Container fluid className="home-section">
        <Particle />

        {/* Full-width and full-height container for car model */}
        <div className="car-model-background">
          <CarModel />

          {/* Background Video Container */}
          <Container className="video-container">
            <video autoPlay muted className="background-video">
              <source src={backgroundVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Container>

          {/* Heading Text Container */}
          <Container className="heading-container">
            <Row>
              <Col className="heading-col">
                <h1 className="heading">HI THERE!</h1>
                <h1 className="heading-name">
                  <span>I'M</span>
                </h1>
              </Col>
            </Row>
          </Container>

          {/* Name Background Container */}
          <Container
            className="name-background-container"
            style={{ backgroundImage: `url(${nameBackgroundImage})` }}
          />
        </div>
      </Container>

      <Home2 />
    </section>
  );
}

export default Home;
