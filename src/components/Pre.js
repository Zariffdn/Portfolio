import React from "react";

function Pre({ load }) {
  return (
    <div className={`preloader ${load ? "" : "preloader--done"}`.trim()} aria-hidden="true">
      <span className="wordmark preloader__mark">
        ZD<span className="wordmark__dot">.</span>
      </span>
    </div>
  );
}

export default Pre;
