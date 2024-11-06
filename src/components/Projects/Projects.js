import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";

function Projects() {
  const projects = [
    {
      title: "OD",
      desc: "SAP-integrated Learning Management System (LMS) for the Ministry of Commerce and Industry in Qatar. This project includes an admin dashboard to control the system and import Excel sheets, managing employee courses required for promotions with a Competency-Based Grading (CBG) system.",
      urls: [
        "https://admin.od-dev.space/auth/login",
        "https://od-dev.space/auth/login",
      ],
      image: require("../../Assets/Projects/OD.png"), // Replace with the actual image URL if available
    },
    {
      title: "OH-ME",
      desc: "An e-commerce platform for an Italian client that facilitates purchasing products and taking advantage of bundles and offers. The project includes a user-friendly website and an admin dashboard, enhancing the shopping experience and streamlining administrative tasks.",
      urls: ["https://oh-me.ae/", "https://admin.oh-me.ae/login"],
      image: require("../../Assets/Projects/OH-ME.png"), // Replace with the actual image URL if available
    },
    {
      title: "OBH",
      desc: "An ERP system for law organizations, which includes two mobile applications, a user-friendly website, and an admin portal. This integrated solution enhances the efficiency of legal professionals and provides access to legal services for users.",
      urls: [
        "https://obh-client-lawyer-web.vercel.app/",
        "https://obh-admin-phi.vercel.app/",
      ],
      image: require("../../Assets/Projects/OBH.png"), // Replace with the actual image URL if available
    },
    {
      title: "Zumaa",
      desc: "Zumaa is a Mobile App and an Admin WebApp for e-commerce designed to facilitate online buying and selling transactions. The website is divided into three main sections: the Seller section, the User section, and the Delivery section.",
      urls: [
        "https://drive.google.com/drive/folders/1g0DaddLch8YDLdJ30wrffLGXilw7tOP9",
      ],
      image: require("../../Assets/Projects/Zumaa.png"), // Replace with the actual image URL if available
    },
    {
      title: "HSI",
      desc: "Website serves as a powerful platform for HSI (Healthcare Solutions International), an ever-growing organization dedicated to raising the healthcare quality level all over Egypt.",
      urls: [
        "https://hsi-eg.co/",
        "https://drive.google.com/drive/folders/10vFi-ZDA671WRbMHbHJaTuZz7rGrf4M3?usp=sharing",
      ],
      image: require("../../Assets/Projects/HSI.png"), // Replace with the actual image URL if available
    },
    {
      title: "SDMATH",
      desc: "Platform and mobile application project for the SD math program seek to develop children's thinking skills and simplify calculations by using online interactive games that enable children to solve the most complicated problems fast and easily without using calculators.",
      urls: [
        "https://drive.google.com/drive/folders/1DH-PnetwHf2z-5AndEIKT81fFvjliSE0?usp=sharing",
      ],
      image: require("../../Assets/Projects/SDMATH.png"), // Replace with the actual image URL if available
    },
    {
      title: "MOHAMEEK (still working on it)",
      desc: "Software as a Service (SaaS) platform using NestJS that features a comprehensive admin portal and dashboard. The project aims to provide businesses with a streamlined solution for managing their operations efficiently.",
      // urls: [
      //   "still working on it", // You can update this when the link is available
      // ],
      image: require("../../Assets/Projects/MOHAMEEK.png"), // Replace with the actual image URL if available
    },
    {
      title: "Mediosis",
      desc: "A platform for medical articles. It offers a user-friendly interface for readers to explore a wide range of informative and educational medical content. It caters to various user roles, including editors, admin, and users.",
      urls: [
        "https://drive.google.com/drive/folders/1qd7FAbDipId2Igqa_l9t9vbpaqyr8BpY?usp=sharing",
      ],
      image: require("../../Assets/Projects/Mediosis.png"), // Replace with the actual image URL if available
    },
    {
      title: "ShopiHy",
      desc: "My MERN stack e-commerce website. With an integration of MongoDB, Express.js, React.js, and Node.js, I have created an innovative platform that delivers an exceptional online shopping experience.",
      urls: [
        "https://www.linkedin.com/posts/hadeer-hesham-fahmy-45bb671b8_project-shopihy-mernstack-activity-6980269571064643585-zFcB?utm_source=share&utm_medium=member_desktop",
      ],
      image: require("../../Assets/Projects/ShopiHy.jpg"), // Replace with the actual image URL if available
    },
    {
      title: "Old Portfolio",
      desc: "It is a visually appealing and interactive website that showcases my work as a web developer. With smooth animations and seamless transitions, the website also features a dynamic blog section where I share my insights and experiences in the web development field.",
      urls: [
        "https://www.linkedin.com/posts/hadeer-hesham-fahmy-45bb671b8_project-portfoliowebsite-activity-6945008199016034304-CayA?utm_source=share&utm_medium=member_desktop",
      ],
      image: require("../../Assets/Projects/Portfolio.jpg"), // Replace with the actual image URL if available
    },
  ];

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          Selected <strong className="purple">Projects </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: "10px",
          }}
        >
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
            {projects.map((project, index) => (
              <Col md={4} className="project-card">
                <ProjectCard
                  imgPath={project.image}
                  isBlog={false}
                  title={project.title}
                  description={project.desc}
                  urls={project.urls}
                />
              </Col>
            ))}
          </ul>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
