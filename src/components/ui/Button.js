import React from "react";
import { Link } from "react-router-dom";

// variant: primary | accent | ghost | soft
// size: sm | md | lg | icon
// Renders a router Link for `to`, an anchor for `href`, a button otherwise.
function Button({
  to,
  href,
  variant = "primary",
  size = "md",
  icon,
  iconArrow = false,
  iconPosition = "end",
  className = "",
  children,
  external = false,
  type = "button",
  ...rest
}) {
  const cls = [
    "btn",
    `btn--${variant}`,
    size !== "md" ? `btn--${size}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const iconNode = icon ? (
    <span
      className={`btn__icon ${iconArrow ? "btn__icon--arrow" : ""}`.trim()}
      aria-hidden="true"
    >
      {icon}
    </span>
  ) : null;

  const content = (
    <>
      {iconPosition === "start" && iconNode}
      {children}
      {iconPosition === "end" && iconNode}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {content}
      </Link>
    );
  }
  if (href) {
    const ext = external || /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className={cls}
        {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }
  return (
    <button type={type} className={cls} {...rest}>
      {content}
    </button>
  );
}

export default Button;
