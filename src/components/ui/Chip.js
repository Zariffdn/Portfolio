import React from "react";

// tone: default | accent | ok
function Chip({ tone = "default", icon, className = "", children, ...rest }) {
  const cls = ["chip", tone !== "default" ? `chip--${tone}` : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={cls} {...rest}>
      {icon && (
        <span aria-hidden="true" style={{ display: "inline-flex" }}>
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}

export default Chip;
