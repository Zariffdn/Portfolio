import { useEffect, useRef, useState } from "react";

// Returns [ref, seen]. `seen` flips to true the first time the node enters
// the viewport and stays true. Falls back to true when IntersectionObserver
// is unavailable.
export default function useInViewOnce(threshold = 0.3) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, seen];
}
