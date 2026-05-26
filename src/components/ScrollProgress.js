import React, { useEffect, useRef } from "react";

function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const height =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? scrolled / height : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />;
}

export default ScrollProgress;
