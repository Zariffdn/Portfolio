import { Chip, Stagger, StaggerItem } from "../ui";

// Shared rail-and-dot timeline used by Experience and Education.
// entries: [{ id, period, role, company, meta, bullets, tags, tagsLabel, extra }]
function Timeline({ entries }) {
  return (
    <div className="tl">
      <Stagger as="ul" role="list" className="tl__list">
        {entries.map((e) => (
          <StaggerItem as="li" key={e.id} className="tl__item">
            <span className="eyebrow eyebrow--plain tl__period">{e.period}</span>
            <h3>{e.role}</h3>
            <p className="tl__company">{e.company}</p>
            {e.meta && <p className="text-3 small tl__meta">{e.meta}</p>}
            {e.bullets && e.bullets.length > 0 && (
              <ul className="tl__bullets text-2">
                {e.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
            {e.tags && e.tags.length > 0 && (
              <ul className="chip-row tl__tags" role="list" aria-label={e.tagsLabel}>
                {e.tags.map((tag) => (
                  <li key={tag}>
                    <Chip>{tag}</Chip>
                  </li>
                ))}
              </ul>
            )}
            {e.extra}
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

export default Timeline;
