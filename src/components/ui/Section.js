import React from "react";

// tone: "default" | "alt"   hairline: draws a top border   tight: 60% padding
function Section({
  as: Tag = "section",
  tone = "default",
  hairline = false,
  tight = false,
  flushTop = false,
  className = "",
  children,
  ...rest
}) {
  const cls = [
    "section",
    tone === "alt" ? "section--alt" : "",
    hairline ? "section--hairline" : "",
    tight ? "section--tight" : "",
    flushTop ? "section--flush-top" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}

export default Section;
