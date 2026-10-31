// Popup sheet skeleton blocks (css/sheet.css). Popups compose these instead of writing their own layout.
// Text arrives as given by the source design; nothing here rewrites or adds copy.
import { createButton } from "../../design-system/components/button/button.js?v=3bc56573435e";
import { createIcon } from "../../design-system/icons/icon.js?v=3bc56573435e";
import { createTextAction } from "../../design-system/components/text-action/text-action.js?v=3bc56573435e";

export function node(tag, className, children = []) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  for (const c of [].concat(children)) if (c != null) n.append(c);
  return n;
}

// Paragraphs of supporting text; a string may contain "\n" for a line break kept from the source.
function textBlock(paragraphs) {
  return node("div", "ps__text ds-text-body", [].concat(paragraphs).map((t) => {
    const p = node("p");
    t.split("\n").forEach((line, i) => { if (i) p.append(document.createElement("br")); p.append(line); });
    return p;
  }));
}

function contextIcon(icon, badge) {
  const ic = node("div", "ps__icon", [createIcon(icon, { size: 36 })]);
  if (badge) {
    const b = node("span", "ps__badge ds-corner ds-text-label", [badge]);
    b.dataset.corner = "circular";
    ic.append(b);
  }
  return ic;
}

export function sheet(...blocks) {
  return node("section", "ps", blocks);
}

// Header: optional contextual icon (+ badge), title, supporting text, optional extra (e.g. a callout).
// align "center" is reserved for sign-in gates; everything else is leading-aligned.
export function head({ title, text, extra, icon, badge, align = "start" }) {
  return node("div", `ps__head${align === "center" ? " ps__head--centered" : ""}`, [
    icon ? contextIcon(icon, badge) : null,
    node("h2", "ps__title", [title]),
    text ? textBlock(text) : null,
    extra,
  ]);
}

export function body(children, { compact = false } = {}) {
  return node("div", `ps__body${compact ? " ps__body--compact" : ""}`, children);
}

// primary → Button (primary, fill); secondary → TextAction
export function actions({ primary, secondary }) {
  return node("div", "ps__actions", [
    primary ? createButton({ label: primary.label, variant: "primary", width: "fill", onClick: primary.onClick }) : null,
    secondary ? createTextAction(secondary) : null,
  ]);
}
