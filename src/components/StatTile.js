import React from "react";
import { useTranslation } from "react-i18next";
import { Stagger } from "./ui";
import useCountUp from "../hooks/useCountUp";
import "../styles/stat-tile.css";

// One stat tile. The numeral counts up once `started` flips; it stays
// aria-hidden and a visually hidden span carries the final value so screen
// readers get "80+" straight away instead of every intermediate frame.
// Labels come from the locale files under stats.<label>.
export function StatTile({ value, suffix = "", label, started }) {
  const { t } = useTranslation();
  const count = useCountUp(value, started);
  return (
    <div className="surface stat-tile">
      <div className="stat-tile__value">
        <span className="tabular" aria-hidden="true">
          {count}
        </span>
        {suffix ? (
          <span className="stat-tile__suffix" aria-hidden="true">
            {suffix}
          </span>
        ) : null}
        <span className="sr-only">{`${value}${suffix}`}</span>
      </div>
      <span className="eyebrow eyebrow--plain stat-tile__label">
        {t(`stats.${label}`)}
      </span>
    </div>
  );
}

// Staggered grid for tiles: four columns on desktop, two under 768px.
// Direct children (StaggerItem or any Reveal wrapper) become grid cells so
// every tile stretches to the same height.
export function StatGrid({ as = "ul", className, children, ...rest }) {
  const isList = as === "ul" || as === "ol";
  return (
    <Stagger
      as={as}
      role={isList ? "list" : undefined}
      className={className ? `stat-grid ${className}` : "stat-grid"}
      {...rest}
    >
      {children}
    </Stagger>
  );
}

export default StatTile;
