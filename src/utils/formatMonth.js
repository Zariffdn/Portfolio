// Renders an ISO "YYYY-MM" month as a localised label: "July 2025" for en,
// "Julai 2025" for ms. Anything malformed comes back unchanged so a bad data
// entry shows its raw value instead of blanking the row.
export function formatMonth(iso, lang) {
  try {
    const [year, month] = String(iso).split("-").map(Number);
    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      return iso;
    }
    return new Intl.DateTimeFormat(lang === "ms" ? "ms-MY" : "en-GB", {
      month: "long",
      year: "numeric",
    }).format(new Date(year, month - 1, 1));
  } catch (e) {
    return iso;
  }
}

export default formatMonth;
