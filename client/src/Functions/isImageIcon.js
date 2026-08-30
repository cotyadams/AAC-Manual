// An uploaded icon is stored as a data: URL; a typed icon is plain
// emoji/text -- this is how the grid and admin form tell them apart.
export default function isImageIcon(icon) {
  return typeof icon === "string" && icon.startsWith("data:image");
}