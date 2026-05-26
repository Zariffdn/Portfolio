import { useEffect } from "react";

export default function usePageMeta({ title, description }) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) document.title = title;

    const descTag = document.querySelector('meta[name="description"]');
    const previousDesc = descTag ? descTag.getAttribute("content") : null;
    if (description && descTag) descTag.setAttribute("content", description);

    return () => {
      document.title = previousTitle;
      if (descTag && previousDesc !== null) {
        descTag.setAttribute("content", previousDesc);
      }
    };
  }, [title, description]);
}
