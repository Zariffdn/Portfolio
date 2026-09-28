import { useTranslation } from "react-i18next";
import "../../styles/about.css";
import usePageMeta from "../../hooks/usePageMeta";
import AboutCard from "./AboutCard";
import Experience from "./Experience";
import FeaturedWork from "./FeaturedWork";
import Education from "./Education";
import Certifications from "./Certifications";
import Testimonials from "./Testimonials";
import Stack from "./Stack";
import Github from "./Github";
import FAQ from "./FAQ";
import Contact from "./Contact";

// Page wrapper only. Every section renders its own <Section> and heading.
// The headline stats live on Home and the press list on the MyTax case study
// (/mytax#press), so neither repeats here. The "On this page" chips in
// AboutCard link the ids of Experience, Education, Certifications, Stack
// (#skills), FAQ and Contact; keep them in step with this order.
function About() {
  const { t } = useTranslation();

  usePageMeta({
    title: t("meta.about"),
    description: t("meta.aboutDesc"),
  });

  return (
    <div className="about-page">
      <AboutCard />
      <Experience />
      <FeaturedWork />
      <Education />
      <Certifications />
      <Testimonials />
      <Stack />
      <Github />
      <FAQ />
      <Contact />
    </div>
  );
}

export default About;
