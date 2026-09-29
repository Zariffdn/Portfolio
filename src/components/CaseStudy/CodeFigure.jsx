// A short code excerpt with a caption saying where it comes from. The pre
// wraps instead of scrolling (casestudy.css), so a study rewraps long lines
// in the source string before passing it here.
function CodeFigure({ caption, children }) {
  return (
    <figure className="cs-code">
      <pre>
        <code>{children}</code>
      </pre>
      <figcaption className="mono cs-art__caption">{caption}</figcaption>
    </figure>
  );
}

export default CodeFigure;
