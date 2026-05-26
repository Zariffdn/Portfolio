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
      node.style.transform = `translate3d(${currentX - 12}px, ${currentY - 12}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      node.style.opacity = "0";
    };
    const onEnter = () => {
      if (hasMoved) node.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
}

export default CustomCursor;
