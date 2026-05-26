import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.svg";
import Tilt from "react-parallax-tilt";
import { AiFillGithub, AiOutlineMail } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              LET ME <span className="purple"> INTRODUCE </span> MYSELF
            </h1>
            <p className="home-about-body">
              I'm a developer who loves turning ideas into apps people can
              actually tap, swipe, and use. 📱 Still picking up new tricks
              every day, and enjoying the ride.
              <br />
              <br />
              Day to day, I work with
              <i>
                <b className="purple"> Flutter and Dart </b>
              </i>
              at Zen Computer System, where I debug and support our mobile
              apps. From earlier projects I'm also comfortable with
              <i>
                <b className="purple"> C++, Python, JavaScript, and PHP. </b>
              </i>
              <br />
              <br />
              My focus is&nbsp;
              <i>
                <b className="purple">Mobile Development</b>
              </i>
              : building clean UIs and smooth user experiences across&nbsp;
              <i>
                <b className="purple">iOS and Android</b>
              </i>
              , with a side interest in&nbsp;
              <i>
                <b className="purple">Front-End</b>
              </i>
              &nbsp;web work.
              <br />
              <br />
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <h1>FIND ME ON</h1>
            <p>
              Feel free to <span className="purple">connect </span>with me
            </p>
            <ul className="home-about-social-links">
              <li className="social-icons">
                <a
                  href="https://github.com/Zariffdn"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiFillGithub />
                </a>
              </li>
 
              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/in/zariffdanial/"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <FaLinkedinIn />
                </a>
              </li>

              <li className="social-icons">
                <a
                  href="mailto:zariffdanial.zul@gmail.com"
                  aria-label="Email Zariff"
                  className="icon-colour  home-social-icons"
                >
                  <AiOutlineMail />
                </a>
              </li>

            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
