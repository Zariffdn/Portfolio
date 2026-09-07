import React from "react";
import { useTranslation } from "react-i18next";
import { storeLinks } from "../data/mytax";
import "../styles/store-links.css";

// App Store / Google Play / AppGallery buttons with install counts.
// Labels and counts come from the locale files under store.<kind>.*;
// the values in data/mytax.js are the English fallbacks.
// compact: shorter buttons, no count chips.
function StoreLinks({ compact = false, className = "" }) {
  const { t } = useTranslation();
  return (
    <div className={`store-links ${compact ? "store-links--compact" : ""} ${className}`.trim()}>
      {storeLinks.map(({ kind, url, Icon, small, big, aria, count }) => {
        const smallText = t(`store.${kind}.small`, small);
        const ariaText = t(`store.${kind}.aria`, aria);
        const countText = count ? t(`store.${kind}.count`, count) : "";
        return (
          <a
            key={kind}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="store-link"
            aria-label={countText ? `${ariaText}, ${countText}` : ariaText}
          >
            <Icon aria-hidden="true" className="store-link__icon" />
            <span className="store-link__text">
              <small>{smallText}</small>
              <strong>{big}</strong>
            </span>
            {countText && !compact && (
              <span className="chip chip--accent store-link__count" aria-hidden="true">
                {countText}
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
}

export default StoreLinks;
