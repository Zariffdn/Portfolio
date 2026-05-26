import React, { useEffect, useRef, useState } from "react";

function CustomCursor() {
  const cursorRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");

    const decide = () => {
      setEnabled(!reduceMotion.matches && !coarsePointer.matches);
    };
    decide();

    reduceMotion.addEventListener("change", decide);
    coarsePointer.addEventListener("change", decide);

    return () => {
      reduceMotion.removeEventListener("change", decide);
      coarsePointer.removeEventListener("change", decide);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const node = cursorRef.current;
    if (!node) return;

    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let hasMoved = false;
    let scale = 1;
    let targetScale = 1;
    const interactiveSelector =
      'a, button, [role="button"], [tabindex]:not([tabindex="-1"]), .project-card-view, .tech-icons, .theme-toggle-btn, .lang-toggle-btn';

    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!hasMoved) {
        currentX = targetX;
        currentY = targetY;
        node.style.opacity = "1";
        hasMoved = true;
      }
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      scale += (targetScale - scale) * 0.22;
      node.style.transform = `translate3d(${currentX - 12}px, ${currentY - 12}px, 0) scale(${scale})`;
      rafId = requestAnimationFrame(tick);
    };

    const onOver = (e) => {
      if (e.target.closest && e.target.closest(interactiveSelector)) {
        targetScale = 1.9;
        node.classList.add("cursor-hover");
      } else {
        targetScale = 1;
        node.classList.remove("cursor-hover");
      }
    };

    const onLeave = () => {
      node.style.opacity = "0";
    };
    const onEnter = () => {
      if (hasMoved) node.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
}

export default CustomCursor;
