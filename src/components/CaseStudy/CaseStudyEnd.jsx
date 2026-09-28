import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { Reveal } from "../ui";
import BackLink from "./BackLink";
import { nextStudy } from "./studies";

// Closes every case study: a contact line, the next study in the chain from
// studies.js, then the way back to Projects.
function CaseStudyEnd({ current }) {
  const next = nextStudy(current);
  return (
    <Reveal className="cs-end">
      <p className="cs-contact">
        Hiring for a Flutter or mobile role?{" "}
        <Link to="/about#contact" className="link-arrow">
          Get in touch <FiArrowRight aria-hidden="true" />
        </Link>
      </p>
      {next && (
        <Link to={next.path} className="surface surface--interactive cs-next">
          <span className="cs-next__body">
            <span className="eyebrow eyebrow--plain cs-next__eyebrow">
              Next case study
            </span>
            <span className="cs-next__title">{next.title}</span>
            <span className="cs-next__teaser text-2">{next.teaser}</span>
          </span>
          <span className="cs-next__arrow" aria-hidden="true">
            <FiArrowRight />
          </span>
        </Link>
      )}
      <BackLink />
    </Reveal>
  );
}

export default CaseStudyEnd;
