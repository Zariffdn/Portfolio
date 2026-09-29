import mytax1 from "../Assets/featured/pic 1.webp";
import mytax2 from "../Assets/featured/pic 2.webp";
import mytax3 from "../Assets/featured/pic 3.webp";
import mytax1Small from "../Assets/featured/pic 1-300.webp";
import mytax2Small from "../Assets/featured/pic 2-300.webp";
import mytax3Small from "../Assets/featured/pic 3-300.webp";
import silent1 from "../Assets/featured/silent-1.webp";
import silent3 from "../Assets/featured/silent-3.webp";
import silent1Small from "../Assets/featured/silent-1-300.webp";
import silent2 from "../Assets/featured/silent-2.webp";
import silent2Small from "../Assets/featured/silent-2-300.webp";
import silent3Small from "../Assets/featured/silent-3-300.webp";
import halalsaji1 from "../Assets/featured/halalsaji-1.webp";
import halalsaji1Small from "../Assets/featured/halalsaji-1-300.webp";

// Every phone screenshot the site renders, paired with the 300px rendition
// PhoneFrame offers to 1x screens. Originals are 589x1280 WebP; the small ones
// are the same crops resized to 300px wide (see the pic N-300 / silent-N-300
// naming), all encoded at the same quality. Register a pair here and any
// PhoneFrame that shows the full src gets the srcset, and the width and height
// that reserve its space before it loads, for free.

// Intrinsic widths of the two renditions, and the full one's height.
export const screenshotWidth = 589;
export const screenshotSmallWidth = 300;
export const screenshotHeight = 1280;

// Default sizes hints per PhoneFrame size, so the browser picks the 300w
// rendition on 1x screens and the full 589w one on 2x and up. A frame is never
// wider than 300px (md) or 220px (sm) on desktop.
export const screenshotSizes = "(max-width: 767px) 60vw, 300px";
export const screenshotSizesSmall = "(max-width: 767px) 40vw, 220px";

const registry = new Map();

// Pairs a full-size screenshot with its small rendition. The options let a
// future set with different dimensions register without changing the defaults.
export function register(
  fullSrc,
  smallSrc,
  { full = screenshotWidth, small = screenshotSmallWidth, height = screenshotHeight } = {}
) {
  registry.set(fullSrc, { smallSrc, full, small, height });
  return fullSrc;
}

// Intrinsic width and height of a registered screenshot's full rendition, for
// the img width and height attributes, or null for any other image.
export function dimensionsFor(src) {
  const entry = registry.get(src);
  if (!entry) return null;
  return { width: entry.full, height: entry.height };
}

// srcset splits candidates on whitespace and commas, and some screenshot
// filenames contain a space, so those two characters are percent-encoded.
const srcsetUrl = (url) => url.replace(/[ ,]/g, encodeURIComponent);

// srcSet and sizes for a registered screenshot src, or null for any other
// image so the caller can fall back to a plain src.
export function srcSetFor(src) {
  const entry = registry.get(src);
  if (!entry) return null;
  return {
    srcSet: `${srcsetUrl(entry.smallSrc)} ${entry.small}w, ${srcsetUrl(src)} ${entry.full}w`,
    sizes: screenshotSizes,
  };
}

register(mytax1, mytax1Small);
register(mytax2, mytax2Small);
register(mytax3, mytax3Small);
register(silent1, silent1Small);
register(silent2, silent2Small);
register(silent3, silent3Small);
register(halalsaji1, halalsaji1Small);

// The MyTax shots, in the order the home hero and case study show them.
export const mytaxScreens = [mytax1, mytax2, mytax3];

// Silent Support: the emotional check-in, the "Looking back" history and the
// response screen. The check-in is the one the project card shows; the
// history screen shows test data, confirmed by Zariff.
export const silentSupportScreens = [silent1, silent2, silent3];

// HalalSaji: the Nearby list, captured from a web build of the app at 1pm
// Malaysia time on its sample data (no certificate numbers on screen).
export const halalSajiScreens = [halalsaji1];
