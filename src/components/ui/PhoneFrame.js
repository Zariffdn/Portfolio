import React from "react";
import {
  srcSetFor,
  screenshotSizes,
  screenshotSizesSmall,
} from "../../data/screenshots";

// Widest each frame size renders, so the browser can pick the 300w rendition
// on 1x screens and the full 589w one on 2x and up.
const SIZES = {
  md: screenshotSizes,
  sm: screenshotSizesSmall,
};

// size:     "md" | "sm"
// priority: the one above-the-fold shot; loads eagerly at high fetch priority
// sizes:    overrides the per-size default when a page renders the frame narrower
function PhoneFrame({ src, alt, size = "md", priority = false, sizes, className = "", style }) {
  const cls = ["phone", size === "sm" ? "phone--sm" : "", className]
    .filter(Boolean)
    .join(" ");
  const responsive = srcSetFor(src);
  const imgProps = {};
  if (responsive) {
    imgProps.srcSet = responsive.srcSet;
    imgProps.sizes = sizes || SIZES[size] || SIZES.md;
  }
  // React 17 has no fetchPriority prop, so the lowercase DOM attribute is
  // passed straight through instead.
  if (priority) imgProps.fetchpriority = "high";
  return (
    <div className={cls} style={style}>
      <div className="phone__screen">
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...imgProps}
        />
      </div>
      <span className="phone__island" aria-hidden="true" />
    </div>
  );
}

export default PhoneFrame;
