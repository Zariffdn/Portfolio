import { useEffect, useState } from "react";

// Counts from 0 to `target` with an ease-out curve once `started` is true.
export default function useCountUp(target, started, duration = 1600) {
  const [count, setCount] = useState(0);
  // When `started` flips back to false the numeral resets to 0. Adjusting
  // state during render (rather than in the effect) avoids an extra pass.
  const [wasStarted, setWasStarted] = useState(started);
  if (wasStarted !== started) {
    setWasStarted(started);
    if (!started) setCount(0);
  }

  useEffect(() => {
    if (!started) return undefined;
    let frame;
    let start;
    const tick = (ts) => {
      if (start === undefined) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, started, duration]);

  return count;
}
