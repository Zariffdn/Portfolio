// The case studies in reading order. Each page ends with a "Next case study"
// card for the entry after it, and the last one wraps round to the first, so
// adding a study is one entry here in the place it should be read.
// Case studies are English only, so the title and teaser are plain English.
export const caseStudies = [
  {
    path: "/mytax",
    title: "MyTax",
    teaser:
      "Malaysia's official income tax app, which I ship to three app stores as its sole mobile developer.",
  },
  {
    path: "/bestinet",
    title: "TOTP authenticator",
    teaser:
      "Tracing why an internal authenticator never showed a code, and fixing the two defects behind it.",
  },
  {
    path: "/silent-support",
    title: "Silent Support",
    teaser:
      "My React Native app: a calm, written reply at once, and an AI reply only if it arrives within 2.5 seconds.",
  },
  {
    path: "/baglock",
    title: "Anti-theft fingerprint bag lock",
    teaser:
      "My final year project: a backpack lock that texts its owner a theft alert and its GPS coordinates.",
  },
];

// The study after `path`, wrapping from the last to the first. Null when the
// path is not in the list or the list has nothing else to offer.
export function nextStudy(path) {
  const i = caseStudies.findIndex((study) => study.path === path);
  if (i === -1 || caseStudies.length < 2) return null;
  return caseStudies[(i + 1) % caseStudies.length];
}
