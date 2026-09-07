import React from "react";

function Container({ as: Tag = "div", narrow = false, className = "", children, ...rest }) {
  const cls = ["container", narrow ? "container--narrow" : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}

export default Container;
