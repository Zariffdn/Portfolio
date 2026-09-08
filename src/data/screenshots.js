import mytax1 from "../Assets/featured/pic 1.jpeg";
import mytax2 from "../Assets/featured/pic 2.jpeg";
import mytax3 from "../Assets/featured/pic 3.jpeg";
import mytax1Small from "../Assets/featured/pic 1-300.jpeg";
import mytax2Small from "../Assets/featured/pic 2-300.jpeg";
import mytax3Small from "../Assets/featured/pic 3-300.jpeg";
import silent1 from "../Assets/featured/silent-1.jpeg";
import silent2 from "../Assets/featured/silent-2.jpeg";
import silent3 from "../Assets/featured/silent-3.jpeg";
import silent1Small from "../Assets/featured/silent-1-300.jpeg";
import silent2Small from "../Assets/featured/silent-2-300.jpeg";
import silent3Small from "../Assets/featured/silent-3-300.jpeg";

// Every phone screenshot the site renders, paired with the 300px rendition
// PhoneFrame offers to 1x screens. Originals are 589x1280; the small ones are
// the same crops resized to 300px wide (see the pic N-300 / silent-N-300
// naming). Register a pair here and any PhoneFrame that shows the full src
// gets the srcset for free.

// Intrinsic widths of the two renditions.
export const screenshotWidth = 589;
export const screenshotSmallWidth = 300;

// Default sizes hints per PhoneFrame size, so the browser picks the 300w
// rendition on 1x screens and the full 589w one on 2x and up. A frame is never
// wider than 300px (md) or 220px (sm) on desktop.
export const screenshotSizes = "(max-width: 767px) 60vw, 300px";
export const screenshotSizesSmall = "(max-width: 767px) 40vw, 220px";

const registry = new Map();

// Pairs a full-size screenshot with its small rendition. widths lets a future
// set with different dimensions register without changing the defaults.
export function register(
  fullSrc,
  smallSrc,
  { full = screenshotWidth, small = screenshotSmallWidth } = {}
) {
  registry.set(fullSrc, { smallSrc, full, small });
  return fullSrc;
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

// The MyTax shots, in the order the home hero and case study show them.
export const mytaxScreens = [mytax1, mytax2, mytax3];

// Silent Support: the emotional check-in, the "Looking back" history, and the
// response screen. The check-in is the one the project card shows.
export const silentSupportScreens = [silent1, silent2, silent3];
