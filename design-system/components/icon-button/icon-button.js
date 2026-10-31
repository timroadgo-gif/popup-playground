// IconButton factory. createIconButton({ icon, ariaLabel, onClick }) → <button> with the canonical glass surface.
// Material comes from GlassSurface (../../glass/glass.js + css/glass.css); this file never styles glass itself.
import { createIcon } from "../../icons/icon.js?v=950bf01060f3";
import { applyGlass } from "../../glass/glass.js?v=950bf01060f3";

const MATERIALS = ["glass-light"]; // IconButton / Glass / Light / 44 is the only approved variant

export function createIconButton({ icon, ariaLabel, material = "glass-light", type = "button", onClick } = {}) {
  if (!icon) throw new Error("IconButton: icon is required");
  if (!ariaLabel) throw new Error("IconButton: ariaLabel is required (icon-only control)");
  if (!MATERIALS.includes(material)) throw new Error(`IconButton: material "${material}" is not one of ${MATERIALS.join(" | ")}`);

  const el = document.createElement("button");
  el.className = "ds-icon-button";
  el.type = type;
  el.setAttribute("aria-label", ariaLabel);
  el.append(createIcon(icon));
  applyGlass(el, { shape: "circle", material: "light" });
  if (onClick) el.addEventListener("click", onClick);
  return el;
}
