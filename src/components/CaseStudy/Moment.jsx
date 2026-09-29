import { Container, Section, Reveal } from "../ui";

// The band between the art and the body: one display line (the children)
// with a label under it saying what the line is. MyTax shows its install
// count there instead (.cs-stat), so it is the one study without this.
function Moment({ label, children }) {
  return (
    <Section tight>
      <Container>
        <Reveal>
          <div className="cs-moment">
            <p className="cs-moment__line">{children}</p>
            <span className="eyebrow eyebrow--plain cs-moment__label">{label}</span>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export default Moment;
