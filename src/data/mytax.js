import { FaApple, FaGooglePlay } from "react-icons/fa";
import { SiHuawei } from "react-icons/si";
import { mytaxScreens } from "./screenshots";

// The responsive-image helpers live in data/screenshots.js now; they are
// re-exported here so existing imports keep working.
export {
  screenshotWidth,
  screenshotSmallWidth,
  screenshotSizes,
  srcSetFor,
} from "./screenshots";

// Everything MyTax-related that more than one page shows.
export const screenshots = mytaxScreens;

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
