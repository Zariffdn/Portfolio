import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.svg";
import Tilt from "react-parallax-tilt";
import { AiFillGithub, AiOutlineMail } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function Home2() {
  const { t } = useTranslation();

  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              {t("home2.headingPre")}{" "}
              <span className="purple"> {t("home2.headingHighlight")} </span>{" "}
              {t("home2.headingPost")}
            </h1>
            <p className="home-about-body">
              {t("home2.bioP1")}
              <br />
              <br />
              {t("home2.bioP2_pre")}{" "}
              <i>
                <b className="purple"> {t("home2.bioP2_flutterDart")} </b>
              </i>
              {" "}{t("home2.bioP2_mid")}{" "}
              <i>
                <b className="purple"> {t("home2.bioP2_langs")} </b>
              </i>
              <br />
              <br />
              {t("home2.bioP3_pre")}&nbsp;
              <i>
                <b className="purple">{t("home2.bioP3_mobileDev")}</b>
              </i>
              {t("home2.bioP3_mid")}&nbsp;
              <i>
                <b className="purple">{t("home2.bioP3_platforms")}</b>
              </i>
              {t("home2.bioP3_mid2")}&nbsp;
              <i>
                <b className="purple">{t("home2.bioP3_frontend")}</b>
              </i>
              &nbsp;{t("home2.bioP3_post")}
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
            <h1>{t("home2.findMeOn")}</h1>
            <p>
              {t("home2.connectPre")}{" "}
              <span className="purple">{t("home2.connectHighlight")} </span>
              {t("home2.connectPost")}
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
