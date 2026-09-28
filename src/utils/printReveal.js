// Blocks that reveal on scroll (framer-motion's whileInView) wait at opacity
// 0 in an inline style until they are scrolled to, and a print stylesheet
// cannot outrank an inline style without !important. So before printing,
// clear the inline opacity and offset of every block still waiting, and put
// them back afterwards so the reveal still plays when the reader scrolls.
// A block that framer-motion animated in the meantime has written its own
// values and is left alone.
export default function installPrintReveal() {
  let hidden = [];

  const beforePrint = () => {
    hidden = [];
    document.querySelectorAll("#root [style]").forEach((el) => {
      const { opacity, transform } = el.style;
      if (opacity === "" || Number(opacity) >= 1) return;
      hidden.push([el, opacity, transform]);
      el.style.opacity = "";
      el.style.transform = "";
    });
  };

  const afterPrint = () => {
    hidden.forEach(([el, opacity, transform]) => {
      if (el.style.opacity !== "") return;
      el.style.opacity = opacity;
      el.style.transform = transform;
    });
    hidden = [];
  };

  window.addEventListener("beforeprint", beforePrint);
  window.addEventListener("afterprint", afterPrint);
  return () => {
    window.removeEventListener("beforeprint", beforePrint);
    window.removeEventListener("afterprint", afterPrint);
  };
}
