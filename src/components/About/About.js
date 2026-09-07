import React from "react";
import { useTranslation } from "react-i18next";
import "../../styles/about.css";
import usePageMeta from "../../hooks/usePageMeta";
import AboutCard from "./AboutCard";
import FeaturedWork from "./FeaturedWork";
import PressFeaturedIn from "./PressFeaturedIn";
import StatsCounter from "./StatsCounter";
import Experience from "./Experience";
import Education from "./Education";
import Certifications from "./Certifications";
import Testimonials from "./Testimonials";
import Stack from "./Stack";
import FAQ from "./FAQ";
import Github from "./Github";
import Contact from "./Contact";

// Page wrapper only. Every section renders its own <Section> and heading.
function About() {
  const { t } = useTranslation();

  usePageMeta({
    title: t("meta.about"),
    description: t("meta.aboutDesc"),
  });

  return (
    <div className="about-page">
      <AboutCard />
      <FeaturedWork />
      <PressFeaturedIn />
      <StatsCounter />
      <Experience />
      <Education />
      <Certifications />
      <Testimonials />
      <Stack />
      <FAQ />
      <Github />
      <Contact />
    </div>
  );
}

export default About;
