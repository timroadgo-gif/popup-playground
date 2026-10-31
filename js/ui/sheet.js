// Popup sheet skeleton blocks (css/sheet.css). Popups compose these instead of writing their own layout.
// Text arrives as given by the source design; nothing here rewrites or adds copy.
import { createButton } from "../../design-system/components/button/button.js?v=e353b1c2a59d";
import { createIcon } from "../../design-system/icons/icon.js?v=e353b1c2a59d";
import { createTextAction } from "../../design-system/components/text-action/text-action.js?v=e353b1c2a59d";

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

const closeSpacer = () => {
  const slot = node("div", "ps__close");
  slot.dataset.closeSlot = "";
  slot.setAttribute("aria-hidden", "true");
  return slot;
};

// Header patterns (experimental, see css/sheet.css):
//  layout "nav"     — Pattern A: compact title centred on the whole panel in the close-button band; content below.
//                     Falls back to "content" automatically when the title needs more than two lines (adaptHeaders).
//  layout "content" — Pattern B (default): title is the first content heading, beside a reserved X footprint.
//  align "center"   — icon-led sign-in gates: centred icon in the X band, title and text below it.
export function head({ title, kicker, text, extra, icon, badge, align = "start", layout = "content" }) {
  const centered = align === "center";
  const nav = layout === "nav" && !centered && !icon && title;
  const parts = [];
  if (nav) {
    parts.push(node("div", "ps__nav", [node("h2", "ps__nav-title ds-text-heading-s", [title])]));
  } else {
    const h = title ? node("h2", "ps__title", [title]) : null;
    parts.push(icon ? contextIcon(icon, badge) : null);
    parts.push(kicker && h ? node("div", "ps__titles", [Object.assign(node("p", "ps__kicker ds-text-caption"), { textContent: kicker }), h]) : h);
    parts.push(centered ? null : closeSpacer());
  }
  parts.push(text ? textBlock(text) : null, extra);
  return node("div", `ps__head${centered ? " ps__head--centered" : ""}${nav ? " ps__head--nav" : ""}`, parts);
}

// Called by the host once the sheet is in the DOM: a navigation title longer than two lines becomes a content heading.
export function adaptHeaders(root) {
  for (const t of root.querySelectorAll(".ps__nav-title")) {
    const lh = parseFloat(getComputedStyle(t).lineHeight);
    if (t.getBoundingClientRect().height <= lh * 2 + 1) continue;
    const head = t.closest(".ps__head");
    head.classList.remove("ps__head--nav");
    t.parentElement.replaceWith(node("h2", "ps__title", [t.textContent]), closeSpacer());
  }
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
