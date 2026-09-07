import React from "react";
import { Link } from "react-router-dom";

function Wordmark({ to = "/", className = "", ...rest }) {
  return (
    <Link
      to={to}
      className={`wordmark ${className}`.trim()}
      aria-label="Zariff Danial, home"
      {...rest}
    >
      ZD<span className="wordmark__dot">.</span>
    </Link>
  );
}

export default Wordmark;
