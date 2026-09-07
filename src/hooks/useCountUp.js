import { useEffect, useState } from "react";

// Counts from 0 to `target` with an ease-out curve once `started` is true.
export default function useCountUp(target, started, duration = 1600) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) {
      setCount(0);
      return undefined;
    }
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
