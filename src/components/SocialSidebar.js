import React from "react";
import { AiFillGithub, AiOutlineMail } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

const links = [
  {
    href: "https://github.com/Zariffdn",
    label: "GitHub",
    Icon: AiFillGithub,
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/zariffdanial/",
    label: "LinkedIn",
    Icon: FaLinkedinIn,
    external: true,
  },
  {
    href: "mailto:zariffdanial.zul@gmail.com",
    label: "Email",
    Icon: AiOutlineMail,
    external: false,
  },
];

function SocialSidebar() {
  return (
    <aside className="social-sidebar" aria-label="Social links">
      <ul>
        {links.map(({ href, label, Icon, external }) => (
          <li key={label}>
            {external ? (
              <a
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon />
              </a>
            ) : (
              <a href={href} aria-label={label}>
                <Icon />
              </a>
            )}
          </li>
        ))}
      </ul>
      <span className="social-sidebar-line" aria-hidden="true" />
    </aside>
  );
}

export default SocialSidebar;
