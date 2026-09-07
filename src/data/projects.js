import bag from "../Assets/Projects/bag.png";
import movie from "../Assets/Projects/movie.png";
import bookstore from "../Assets/Projects/bookstore.png";
import silentsupport from "../Assets/Projects/silentsupport.svg";
import bestinet from "../Assets/Projects/bestinet.svg";
import mytaxShot from "../Assets/featured/pic 2.jpeg";

// Single source of truth for the project list. Copy lives in the locale
// files as projects.<id>_title and projects.<id>_desc.
//
// imgKind: "phone" renders the image inside a PhoneFrame (portrait shots).
// imgFit:  "cover" for card art drawn at 16:10, "contain" for mockup PNGs.
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
    img: silentsupport,
    imgFit: "cover",
    personal: true,
    tags: ["React Native", "Expo", "TypeScript", "Supabase", "OpenAI"],
    ghLink: "https://github.com/Zariffdn/Silent-Support-App",
  },
  {
    id: "bestinet",
    category: "mobile",
    img: bestinet,
    imgFit: "cover",
    proprietary: true,
    tags: ["Flutter", "Dart", "GetX", "TOTP", "Secure storage"],
  },
  {
    id: "baglock",
    category: "embedded",
    img: bag,
    imgFit: "contain",
    tags: ["C++", "Arduino", "Fingerprint Sensor", "GPS", "GSM"],
    ghLink: "https://github.com/zazarip/Anti-theft-fingerprint-baglock",
  },
  {
    id: "movie",
    category: "web",
    img: movie,
    imgFit: "contain",
    tags: ["JavaScript", "PHP", "CSS", "MySQL"],
    ghLink: "https://github.com/zazarip/movie-ticket",
  },
  {
    id: "bookstore",
    category: "web",
    img: bookstore,
    imgFit: "contain",
    tags: ["PHP", "HTML", "MySQL"],
    ghLink: "https://github.com/zazarip/Bookstore",
  },
];

export const filters = ["all", "web", "mobile", "embedded"];

// Shown in the "Selected work" section on the home page, in this order.
export const selectedForHome = ["mytax", "silentsupport", "bestinet"];

export const byId = (id) => projects.find((p) => p.id === id);
