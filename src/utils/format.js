export const toList = (value) => {
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string" && v.trim());
  if (typeof value === "string" && value.trim()) return [value];
  return [];
};

export const joinList = (value, max = Infinity) => {
  const unique = [...new Set(toList(value).map((v) => v.trim()))];
  const shown = unique.slice(0, max).join(", ");
  return unique.length > max ? `${shown} +${unique.length - max} more` : shown;
};

export function getCardInfo(record) {
  const o = record?.openfda ?? {};
  return {
    brand: joinList(o.brand_name, 2) || "Unnamed medicine",
    generic: joinList(o.generic_name, 2),
    manufacturer: joinList(o.manufacturer_name, 1),
    productType: joinList(o.product_type),
    route: joinList(o.route),
    substance: joinList(o.substance_name, 3),
  };
}

export function formatDate(raw) {
  if (typeof raw !== "string" || !/^\d{8}$/.test(raw)) return "";
  const d = new Date(`${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}T00:00:00`);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export const SECTIONS = [
  ["indications_and_usage", "Uses"],
  ["purpose", "Purpose"],
  ["active_ingredient", "Active ingredients"],
  ["dosage_and_administration", "Dosage and how to take it"],
  ["warnings", "Warnings"],
  ["do_not_use", "Do not use if"],
  ["ask_doctor", "Ask a doctor before use if"],
  ["ask_doctor_or_pharmacist", "Ask a doctor or pharmacist before use if"],
  ["stop_use", "Stop use and ask a doctor if"],
  ["contraindications", "Contraindications"],
  ["adverse_reactions", "Side effects"],
  ["inactive_ingredient", "Inactive ingredients"],
  ["storage_and_handling", "Storage"],
  ["keep_out_of_reach_of_children", "Keep out of reach of children"],
];
