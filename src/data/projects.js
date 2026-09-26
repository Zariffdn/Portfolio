import bag from "../Assets/Projects/bag.png";
import bookstore from "../Assets/Projects/bookstore.png";
import silentShot from "../Assets/featured/silent-1.jpeg";
import halalSajiShot from "../Assets/featured/halalsaji-1.jpeg";
import bestinet from "../Assets/Projects/bestinet.svg";
import mytaxShot from "../Assets/featured/pic 2.jpeg";

// Single source of truth for the project list. Copy lives in the locale
// files as projects.<id>_title and projects.<id>_desc.
//
// imgKind: "phone" renders the image inside a PhoneFrame (portrait shots).
// imgFit:  "cover" for card art drawn at 16:10, "contain" for mockup PNGs.
// coursework: "fyp" or "team" labels university work (projects.<kind>Badge).
export const projects = [
  {
    id: "mytax",
    category: "mobile",
    img: mytaxShot,
    imgKind: "phone",
    featured: true,
    production: true,
    caseStudy: "/mytax",
    tags: ["Flutter", "Dart", "Provider", "Firebase", "HMS"],
  },
  {
    id: "silentsupport",
    category: "mobile",
    img: silentShot,
    imgKind: "phone",
    personal: true,
    tags: ["React Native", "Expo", "TypeScript", "Supabase", "Groq"],
    ghLink: "https://github.com/Zariffdn/Silent-Support-App",
  },
  {
    // Private repository, so the card shows "No public repo".
    id: "halalsaji",
    category: "mobile",
    img: halalSajiShot,
    imgKind: "phone",
    personal: true,
    tags: ["Flutter", "Dart", "Provider", "Firestore", "Geolocator"],
  },
  {
    id: "bestinet",
    category: "mobile",
    img: bestinet,
    imgFit: "cover",
    proprietary: true,
    caseStudy: "/bestinet",
    tags: ["Flutter", "Dart", "GetX", "TOTP", "Secure storage"],
  },
  {
    id: "baglock",
    category: "embedded",
    img: bag,
    imgFit: "contain",
    coursework: "fyp",
    tags: ["C++", "Arduino", "Fingerprint Sensor", "GPS", "GSM"],
    ghLink: "https://github.com/Zariffdn/Anti-theft-fingerprint-baglock",
  },
  {
    id: "bookstore",
    category: "web",
    img: bookstore,
    imgFit: "contain",
    coursework: "team",
    tags: ["PHP", "HTML", "MySQL"],
    ghLink: "https://github.com/Zariffdn/Bookstore",
  },
];

export const filters = ["all", "web", "mobile", "embedded"];

// Shown in the "Selected work" section on the home page, in this order.
export const selectedForHome = ["mytax", "silentsupport", "bestinet"];

export const byId = (id) => projects.find((p) => p.id === id);
