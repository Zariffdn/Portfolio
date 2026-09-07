import { FaApple, FaGooglePlay } from "react-icons/fa";
import { SiHuawei } from "react-icons/si";
import shot1 from "../Assets/featured/pic 1.jpeg";
import shot2 from "../Assets/featured/pic 2.jpeg";
import shot3 from "../Assets/featured/pic 3.jpeg";
import shot1Small from "../Assets/featured/pic 1-300.jpeg";
import shot2Small from "../Assets/featured/pic 2-300.jpeg";
import shot3Small from "../Assets/featured/pic 3-300.jpeg";

// Everything MyTax-related that more than one page shows.
export const screenshots = [shot1, shot2, shot3];

// Intrinsic widths of the two renditions of every screenshot. The originals
// are 589x1280; the small ones are the same crops resized to 300px wide.
export const screenshotWidth = 589;
export const screenshotSmallWidth = 300;

// Default sizes hint: a phone frame is never wider than 300px on desktop.
export const screenshotSizes = "(max-width: 767px) 60vw, 300px";

const smallScreenshots = new Map([
  [shot1, shot1Small],
  [shot2, shot2Small],
  [shot3, shot3Small],
]);

// srcset splits candidates on whitespace and commas, and the screenshot
// filenames contain a space, so those two characters are percent-encoded.
const srcsetUrl = (url) => url.replace(/[ ,]/g, encodeURIComponent);

// srcSet and sizes for a known screenshot src, or null for any other image so
// the caller can fall back to a plain src.
export function srcSetFor(src) {
  const small = smallScreenshots.get(src);
  if (!small) return null;
  return {
    srcSet: `${srcsetUrl(small)} ${screenshotSmallWidth}w, ${srcsetUrl(src)} ${screenshotWidth}w`,
    sizes: screenshotSizes,
  };
}

export const lifetimeInstalls = "2.8M+";

// Install counts as of May 2026. App Store figure is from App Store Connect;
// Google Play and AppGallery are publicly visible on each store listing.
export const storeLinks = [
  {
    kind: "appstore",
    url: "https://apps.apple.com/my/app/mytax/id1632195676",
    Icon: FaApple,
    small: "Download on the",
    big: "App Store",
    aria: "Download MyTax on the App Store",
    count: "1.7M+ installs",
  },
  {
    kind: "playstore",
    url: "https://play.google.com/store/apps/details?id=com.lhdn.mytax",
    Icon: FaGooglePlay,
    small: "Get it on",
    big: "Google Play",
    aria: "Get MyTax on Google Play",
    count: "894K+ installs",
  },
  {
    kind: "appgallery",
    url: "https://appgallery.cloud.huawei.com/ag/n/app/C106575285",
    Icon: SiHuawei,
    small: "Explore it on",
    big: "AppGallery",
    aria: "Explore MyTax on AppGallery",
    count: "282K+ installs",
  },
];

export const press = [
  {
    id: "bernama-ekyc-2026",
    publication: "BERNAMA",
    title: "MyTax adds e-KYC and digital onboarding for new taxpayers",
    titleOriginal:
      "Portal MyTax LHDN Sedia Kaedah e-KYC, e-CP55D Bagi Pembayar Cukai Baharu",
    url: "https://bernama.com/bm/news.php?id=2522325",
    date: "2026-02",
  },
];
