import React from "react";

// eyebrow: small mono label above the title
// title: string or node; rendered as <h2> by default
// lead: optional supporting sentence
// align: "left" | "center"   aside: node placed to the right on wide screens
function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  as: Tag = "h2",
  id,
  aside,
  className = "",
}) {
  const cls = [
    "section-head",
    align === "center" ? "section-head--center" : "",
    aside ? "section-head--row" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag id={id}>{title}</Tag>
      {lead && <p className="lead">{lead}</p>}
    </>
  );

  return (
    <div className={cls}>
      {aside ? (
        <>
          <div>{inner}</div>
          <div className="section-head__aside">{aside}</div>
        </>
      ) : (
        inner
      )}
    </div>
  );
}

export default SectionHeading;
