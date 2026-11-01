// GlassIconButton factory. createIconButton({ icon, ariaLabel, onClick }) → 44 × 44 circular <button> with the shared
// native-inspired glass (GlassSurface) and the icon in the compact presentation (~15 viewport, optically fitted path,
// 0.9px stroke). size "compact": the glass circle shrinks to 32 (secondary controls such as a popup close) while the
// <button> keeps the 44 × 44 hit area around it. This file never styles glass or resizes icon geometry itself.
import { createIcon } from "../../icons/icon.js?v=2cd7a7f418a6";
import { applyGlass } from "../../glass/glass.js?v=2cd7a7f418a6";

const MATERIALS = ["glass-light"]; // IconButton / Glass / Light / 44 is the only approved variant

const SIZES = ["regular", "compact"];

export function createIconButton({ icon, ariaLabel, material = "glass-light", size = "regular", type = "button", onClick } = {}) {
  if (!icon) throw new Error("IconButton: icon is required");
  if (!ariaLabel) throw new Error("IconButton: ariaLabel is required (icon-only control)");
  if (!MATERIALS.includes(material)) throw new Error(`IconButton: material "${material}" is not one of ${MATERIALS.join(" | ")}`);
  if (!SIZES.includes(size)) throw new Error(`IconButton: size "${size}" is not one of ${SIZES.join(" | ")}`);

  const el = document.createElement("button");
  el.className = `ds-icon-button${size === "compact" ? " ds-icon-button--compact" : ""}`;
  el.type = type;
  el.setAttribute("aria-label", ariaLabel);
  const icn = createIcon(icon, { presentation: "compact" });
  if (size === "compact") {
    const surface = document.createElement("span");
    surface.className = "ds-icon-button__surface";
    surface.append(icn);
    el.append(surface);
    applyGlass(surface, { shape: "circle", material: "light" });
  } else {
    el.append(icn);
    applyGlass(el, { shape: "circle", material: "light" });
  }
  if (onClick) el.addEventListener("click", onClick);
  return el;
}
