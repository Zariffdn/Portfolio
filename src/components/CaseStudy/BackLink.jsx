import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

// Every case study sits under Projects, so every back link goes there.
function BackLink({ className = "" }) {
  return (
    <Link to="/project" className={`link-arrow cs-back ${className}`.trim()}>
      <FiArrowLeft aria-hidden="true" /> Back to Projects
    </Link>
  );
}

export default BackLink;
