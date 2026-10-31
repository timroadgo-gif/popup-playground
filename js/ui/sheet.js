// Shared sheet content blocks (css/sheet.css). Popups compose these instead of writing their own layout.
// Text arrives as given by the source design; nothing here rewrites or adds copy.
import { createButton } from "../../design-system/components/button/button.js?v=950bf01060f3";
import { createIcon } from "../../design-system/icons/icon.js?v=950bf01060f3";
import { createTextAction } from "../../design-system/components/text-action/text-action.js?v=950bf01060f3";

export function node(tag, className, children = []) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  for (const c of [].concat(children)) if (c != null) n.append(c);
  return n;
}

const para = (text, cls) => Object.assign(node("p", cls), { textContent: text });

// Paragraphs of supporting text; a string may contain "\n" for a line break kept from the source.
function textBlock(paragraphs) {
  return node("div", "ps__text ds-text-body", [].concat(paragraphs).map((t) => {
    const p = node("p");
    t.split("\n").forEach((line, i) => { if (i) p.append(document.createElement("br")); p.append(line); });
    return p;
  }));
}

export function sheet(...blocks) {
  return node("section", "ps", blocks);
}

// size: "l" → ds-text-heading-l (source titles 22px), "s" → ds-text-heading-s (source titles 16px)
export function head({ title, size = "l", text, extra }) {
  return node("div", "ps__head", [
    node("h2", `ps__title ds-text-heading-${size}`, [title]),
    text ? textBlock(text) : null,
    extra,
  ]);
}

// Centred header: icon with a "+1" badge, title, supporting line(s).
export function hero({ icon, badge, title, text }) {
  const ic = node("div", "ps__icon", [createIcon(icon, { size: 36 })]);
  if (badge) {
    const b = node("span", "ps__badge ds-corner ds-text-label", [badge]);
    b.dataset.corner = "circular";
    ic.append(b);
  }
  const t = textBlock(text);
  t.classList.replace("ds-text-body", "ds-text-body-s");
  return node("div", "ps__hero", [ic, node("div", "ps__pair", [para(title, "ps__title ds-text-heading-s"), t])]);
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
