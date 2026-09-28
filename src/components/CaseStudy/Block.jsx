import { Reveal } from "../ui";

// Two-digit mono index + hairline above every body block. `id` makes the
// block a link target (it lands below the fixed navbar, see casestudy.css).
function Block({ index, title, id, children }) {
  return (
    <Reveal as="section" className="cs-block" id={id}>
      <span className="eyebrow eyebrow--plain cs-block__index">{index}</span>
      <h2>{title}</h2>
      {children}
    </Reveal>
  );
}

export default Block;
