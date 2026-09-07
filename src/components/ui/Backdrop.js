import React from "react";

// Fixed aurora + film grain behind every page. Replaces the particle field.
function Backdrop() {
  return (
    <div className="site-backdrop" aria-hidden="true">
      <div className="site-backdrop__aurora" />
      <div className="site-backdrop__aurora site-backdrop__aurora--secondary" />
      <div className="site-backdrop__grain" />
    </div>
  );
}

export default Backdrop;
