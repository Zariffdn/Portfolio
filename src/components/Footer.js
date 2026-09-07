import React from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Wordmark from "./ui/Wordmark";

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Wordmark aria-label={t("navbar.wordmarkAria")} />
            <p className="footer__tagline">{t("footer.tagline")}</p>
          </div>

          <div className="footer__col">
            <h2 className="footer__heading">{t("footer.nav")}</h2>
            <ul>
              <li><Link to="/">{t("navbar.home")}</Link></li>
              <li><Link to="/about">{t("navbar.about")}</Link></li>
              <li><Link to="/project">{t("navbar.projects")}</Link></li>
              <li><Link to="/resume">{t("navbar.resume")}</Link></li>
              <li><Link to="/uses">{t("footer.uses")}</Link></li>
              <li><Link to="/mytax">MyTax</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <h2 className="footer__heading">{t("footer.elsewhere")}</h2>
            <ul>
              <li>
                <a href="https://github.com/Zariffdn" target="_blank" rel="noopener noreferrer">
                  <FiGithub aria-hidden="true" /> GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/zariffdanial/" target="_blank" rel="noopener noreferrer">
                  <FiLinkedin aria-hidden="true" /> LinkedIn
                </a>
              </li>
              <li>
                <a href="mailto:zariffdanial.zul@gmail.com">
                  <FiMail aria-hidden="true" /> zariffdanial.zul@<wbr />gmail.com
                </a>
              </li>
              <li>
                <a href="https://github.com/Zariffdn/Portfolio" target="_blank" rel="noopener noreferrer">
                  <FiArrowUpRight aria-hidden="true" /> {t("footer.viewSource")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} Zariff Danial</span>
          <span>{t("footer.builtWith")}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
