import React, { useEffect, useRef, useState } from "react";

// How close the eased position and scale must get to their targets before the
// frame loop parks itself. It wakes again on the next mousemove or hover
// change, so a still pointer costs no per-frame work.
const SETTLE_PX = 0.1;
const SETTLE_SCALE = 0.001;

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
      'a, button, [role="button"], [tabindex]:not([tabindex="-1"]), .btn, .chip, .surface--interactive, .icon-btn';

    const paint = () => {
      node.style.transform = `translate3d(${currentX - 12}px, ${currentY - 12}px, 0) scale(${scale})`;
    };

    const isSettled = () =>
      Math.abs(targetX - currentX) < SETTLE_PX &&
      Math.abs(targetY - currentY) < SETTLE_PX &&
      Math.abs(targetScale - scale) < SETTLE_SCALE;

    const tick = () => {
      rafId = null;
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      scale += (targetScale - scale) * 0.22;
      if (isSettled()) {
        // Land exactly on the target and park the loop.
        currentX = targetX;
        currentY = targetY;
        scale = targetScale;
        paint();
        return;
      }
      paint();
      rafId = requestAnimationFrame(tick);
    };

    // Starts the loop when it is parked; a no-op while it is already running.
    const wake = () => {
      if (rafId === null) rafId = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!hasMoved) {
        currentX = targetX;
        currentY = targetY;
        node.style.opacity = "1";
        hasMoved = true;
      }
      wake();
    };

    const onOver = (e) => {
      const interactive = !!(
        e.target.closest && e.target.closest(interactiveSelector)
      );
      node.classList.toggle("cursor-hover", interactive);
      const nextScale = interactive ? 1.9 : 1;
      if (nextScale !== targetScale) {
        targetScale = nextScale;
        wake();
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
    // No frame is scheduled here: the loop starts on the first mousemove.

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
}

export default CustomCursor;
