// Shared Icon component. createIcon(name, { size, label }) → <svg class="ds-icon">. Colour is inherited (currentColor).
import { ICONS, META } from "./icons.generated.js?v=950bf01060f3";

export const ICON_SIZES = [16, 20, 24, 32, 48]; // documented set; any px value renders proportionally

export function iconMarkup(name, { size = 24, label = "" } = {}) {
  const svg = ICONS[name];
  if (!svg) {
    const reason = META[name] ? `"${name}" is reserved but has no approved geometry yet` : `unknown icon "${name}"`;
    throw new Error(`Icon: ${reason}`);
  }
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  return svg.replace("<svg ", `<svg class="ds-icon" width="${size}" height="${size}" ${a11y} `);
}

export function createIcon(name, options) {
  const tpl = document.createElement("template");
  tpl.innerHTML = iconMarkup(name, options);
  return tpl.content.firstElementChild;
}
