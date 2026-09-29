import { Chip } from "../ui";

// The numbered stepper a case study walks the reader through: one row per
// step, with a two-digit index (decorative, since the list already carries
// the order), a title, the text and at most one chip in the head. A step
// with `flag` was broken at some point: "defect" (Bestinet) draws it in the
// danger tones with a Defect chip, "fixed" (MyTax) in the ok tones with a
// Fixed chip. A step with `chip` shows that label in the plain chip style,
// such as the side it runs on (Silent Support) or the job it serves (bag
// lock). `text` can be a node, so a step can link to a block on the page.
const flags = {
  defect: { label: "Defect", className: "cs-trace__flag" },
  fixed: { label: "Fixed", className: "cs-trace__flag cs-trace__flag--ok" },
};

function Trace({ steps }) {
  return (
    <ol className="cs-trace" role="list">
      {steps.map((step, i) => {
        const flag = flags[step.flag];
        const cls = ["cs-trace__step", flag && `cs-trace__step--${step.flag}`]
          .filter(Boolean)
          .join(" ");
        return (
          <li key={step.title} className={cls}>
            <span className="cs-trace__index" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="cs-trace__body">
              <div className="cs-trace__head">
                <h3 className="cs-trace__title">{step.title}</h3>
                {flag && <Chip className={flag.className}>{flag.label}</Chip>}
                {step.chip && <Chip className="cs-trace__beat">{step.chip}</Chip>}
              </div>
              <p className="cs-trace__text text-2">{step.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default Trace;
