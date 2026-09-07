import React from "react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

// Fades + lifts a block into view once. Same API the old FadeIn had.
export function Reveal({
  children,
  delay = 0,
  y = 20,
  duration = 0.6,
  once = true,
  className,
  as = "div",
  ...rest
}) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Parent for a staggered list. Children should be <StaggerItem>.
export function Stagger({
  children,
  gap = 0.07,
  delay = 0,
  className,
  as = "div",
  once = true,
  ...rest
}) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({ children, y = 18, className, as = "div", ...rest }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
