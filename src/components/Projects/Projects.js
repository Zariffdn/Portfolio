import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import bag from "../../Assets/Projects/bag.png";
import movie from "../../Assets/Projects/movie.png";
import bookstore from "../../Assets/Projects/bookstore.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={bag}
              isBlog={false}
              title="Anti-theft fingerprint baglock"
              description="This project implements an anti-theft system using a fingerprint scanner, GPS module, and GSM module to protect a bag or backpack. The system allows authorized users to unlock the bag using their fingerprints while sending GPS coordinates to a predefined number in case of unauthorized access."
              ghLink="https://github.com/zazarip/Anti-theft-fingerprint-baglock"
              
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={movie}
              isBlog={false}
              title="Movie ticket"
              description="The Movie Ticket Booking System is a web-based application that facilitates easy and convenient booking, cancellation, and management of movie tickets. With separate user and admin interfaces, the system offers a streamlined experience for both users and administrators."
              ghLink="https://github.com/zazarip/movie-ticket"
              
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={bookstore}
              isBlog={false}
              title="Bookstore"
              description="This web application allows customers to explore a variety of books, create accounts, make purchases, and view their purchase history. Sellers have the ability to manage the book inventory and access pickup details for completed orders. The system provides a seamless way for customers to discover and acquire their favorite books, while empowering sellers with the tools to efficiently manage their book offerings."
              ghLink="https://github.com/zazarip/Bookstore"
              
            />
          </Col>





        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
