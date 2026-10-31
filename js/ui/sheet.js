// Popup sheet skeleton blocks (css/sheet.css). Popups compose these instead of writing their own layout.
// Text arrives as given by the source design; nothing here rewrites or adds copy.
import { createButton } from "../../design-system/components/button/button.js?v=c2abed233231";
import { createIcon } from "../../design-system/icons/icon.js?v=c2abed233231";
import { createTextAction } from "../../design-system/components/text-action/text-action.js?v=c2abed233231";

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

// Header: optional contextual icon (+ badge), optional kicker, title, supporting text, optional extra (e.g. a callout).
// Leading headers reserve the X's footprint ([data-close-slot]); the host removes it when there is no X.
// align "center" (icon-led sign-in gates) reserves nothing: the icon shares the X's band, text starts below it.
export function head({ title, kicker, text, extra, icon, badge, align = "start" }) {
  const centered = align === "center";
  let slot = null;
  if (!centered) {
    slot = node("div", "ps__close");
    slot.dataset.closeSlot = "";
    slot.setAttribute("aria-hidden", "true");
  }
  const h = title ? node("h2", "ps__title", [title]) : null;
  const titleBlock = kicker && h ? node("div", "ps__titles", [Object.assign(node("p", "ps__kicker ds-text-overline"), { textContent: kicker }), h]) : h;
  return node("div", `ps__head${centered ? " ps__head--centered" : ""}`, [
    icon ? contextIcon(icon, badge) : null,
    titleBlock,
    slot,
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
