// Popup sheet skeleton blocks (css/sheet.css). Popups compose these instead of writing their own layout.
// Text arrives as given by the source design; nothing here rewrites or adds copy.
import { createButton } from "../../design-system/components/button/button.js?v=60a89303b059";
import { createIcon } from "../../design-system/icons/icon.js?v=60a89303b059";
import { createTextAction } from "../../design-system/components/text-action/text-action.js?v=60a89303b059";

export function node(tag, className, children = []) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  for (const c of [].concat(children)) if (c != null) n.append(c);
  return n;
}

// Paragraphs of supporting text; a string may contain "\n" for a line break kept from the source.
function textBlock(paragraphs) {
  return node("div", "ps__text ds-text-popup-body", [].concat(paragraphs).map((t) => {
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

// Popup headings never end with a period or comma (approved editorial rule, design-system/docs/typography.md).
const clean = (t) => (t ? t.replace(/[.,]+$/u, "") : t);

// Content header. `heading` is the contentHeading (informational, ≤16, multiline). The short contextTitle is variant
// metadata rendered by the host in the navigation header — never pass it here, never derive one from the other.
// align "center" is the icon-led variant for sign-in gates.
export function head({ heading, text, extra, icon, badge, align = "start" }) {
  const centered = align === "center";
  return node("div", `ps__head${centered ? " ps__head--centered" : ""}`, [
    icon ? contextIcon(icon, badge) : null,
    heading ? node("h2", "ps__title ds-text-popup-heading", [clean(heading)]) : null,
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
