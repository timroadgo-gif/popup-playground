// GlassIconButton factory. createIconButton({ icon, ariaLabel, onClick }) → 44 × 44 circular <button> with the shared
// native-inspired glass (GlassSurface) and the icon in the compact presentation (~15 viewport, optically fitted path,
// 0.9px stroke). This file never styles glass or resizes icon geometry itself.
import { createIcon } from "../../icons/icon.js?v=514a9345035d";
import { applyGlass } from "../../glass/glass.js?v=514a9345035d";

const MATERIALS = ["glass-light"]; // IconButton / Glass / Light / 44 is the only approved variant

export function createIconButton({ icon, ariaLabel, material = "glass-light", type = "button", onClick } = {}) {
  if (!icon) throw new Error("IconButton: icon is required");
  if (!ariaLabel) throw new Error("IconButton: ariaLabel is required (icon-only control)");
  if (!MATERIALS.includes(material)) throw new Error(`IconButton: material "${material}" is not one of ${MATERIALS.join(" | ")}`);

  const el = document.createElement("button");
  el.className = "ds-icon-button";
  el.type = type;
  el.setAttribute("aria-label", ariaLabel);
  el.append(createIcon(icon, { presentation: "compact" }));
  applyGlass(el, { shape: "circle", material: "light" });
  if (onClick) el.addEventListener("click", onClick);
  return el;
}
