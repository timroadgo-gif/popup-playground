// SellerTextField — vanilla port of Desktop/Проект/Flow/src/SellerTextField.jsx (commit 5b93ff2, 2026-11-23).
// Same markup/classes: label.seller-field[.is-filled.is-focused.is-invalid.is-multiline] › svg.seller-field__shape (superellipse
// r16 / 60 % smoothing, re-measured on resize) + span.seller-field__body › span.seller-field__label + input|textarea.
// Empty + unfocused: the label rests in the value line; focus or a value lifts it (CSS in seller-text-field.css).
const SVG = "http://www.w3.org/2000/svg";
const SMOOTHING = 0.6;
const RADIUS = 16;

export function squirclePath(width, height, radius = RADIUS, smoothing = SMOOTHING, inset = 0.5) {
  const w = Math.max(0, width - inset * 2);
  const h = Math.max(0, height - inset * 2);
  const maxP = Math.min(w, h) / 2;
  const r = Math.min(radius, maxP);
  const p = Math.min((1 + smoothing) * r, maxP);
  const rad = (deg) => (deg * Math.PI) / 180;
  const arcMeasure = 90 * (1 - smoothing);
  const arc = Math.sin(rad(arcMeasure / 2)) * r * Math.SQRT2;
  const angleAlpha = (90 - arcMeasure) / 2;
  const p3ToP4 = r * Math.tan(rad(angleAlpha / 2));
  const angleBeta = 45 * smoothing;
  const c = p3ToP4 * Math.cos(rad(angleBeta));
  const d = c * Math.tan(rad(angleBeta));
  let b = (p - arc - c - d) / 3;
  let a = 2 * b;
  if (b < 0) { a = 0; b = 0; }
  const f = (n) => Math.round(n * 1000) / 1000;
  const x0 = inset;
  const y0 = inset;
  return [
    `M ${f(x0 + w - p)} ${f(y0)}`,
    `c ${f(a)} 0 ${f(a + b)} 0 ${f(a + b + c)} ${f(d)}`,
    `a ${f(r)} ${f(r)} 0 0 1 ${f(arc)} ${f(arc)}`,
    `c ${f(d)} ${f(c)} ${f(d)} ${f(b + c)} ${f(d)} ${f(a + b + c)}`,
    `L ${f(x0 + w)} ${f(y0 + h - p)}`,
    `c 0 ${f(a)} 0 ${f(a + b)} ${f(-d)} ${f(a + b + c)}`,
    `a ${f(r)} ${f(r)} 0 0 1 ${f(-arc)} ${f(arc)}`,
    `c ${f(-c)} ${f(d)} ${f(-(b + c))} ${f(d)} ${f(-(a + b + c))} ${f(d)}`,
    `L ${f(x0 + p)} ${f(y0 + h)}`,
    `c ${f(-a)} 0 ${f(-(a + b))} 0 ${f(-(a + b + c))} ${f(-d)}`,
    `a ${f(r)} ${f(r)} 0 0 1 ${f(-arc)} ${f(-arc)}`,
    `c ${f(-d)} ${f(-c)} ${f(-d)} ${f(-(b + c))} ${f(-d)} ${f(-(a + b + c))}`,
    `L ${f(x0)} ${f(y0 + p)}`,
    `c 0 ${f(-a)} 0 ${f(-(a + b))} ${f(d)} ${f(-(a + b + c))}`,
    `a ${f(r)} ${f(r)} 0 0 1 ${f(arc)} ${f(-arc)}`,
    `c ${f(c)} ${f(-d)} ${f(b + c)} ${f(-d)} ${f(a + b + c)} ${f(-d)}`,
    "Z",
  ].join(" ");
}

let uid = 0;
// Props as in the React component; anything else (type, inputMode, autocomplete, placeholder, disabled, readOnly) goes to
// the native control. Returns { el, input, setValue, setInvalid, setDisabled, setForcedFocus }.
export function createSellerTextField({ label, value = "", multiline = false, invalid = false, className = "", ...inputProps } = {}) {
  const id = `pg-seller-field-${++uid}`;
  const root = document.createElement("label");
  root.htmlFor = id;
  const body = document.createElement("span");
  body.className = "seller-field__body";
  const labelEl = document.createElement("span");
  labelEl.className = "seller-field__label";
  labelEl.textContent = label;
  const input = document.createElement(multiline ? "textarea" : "input");
  input.id = id;
  input.className = "seller-field__input";
  if (multiline) input.rows = 1;
  for (const [key, val] of Object.entries(inputProps)) if (val != null) input[key] = val;
  input.value = value;
  body.append(labelEl, input);
  root.append(body);

  let focused = false;
  let forcedFocus = false;
  let isInvalid = invalid;
  const sync = () => {
    const filled = String(input.value ?? "").length > 0;
    root.className = `seller-field${filled ? " is-filled" : ""}${focused || forcedFocus ? " is-focused" : ""}${isInvalid ? " is-invalid" : ""}${multiline ? " is-multiline" : ""}${className ? ` ${className}` : ""}`;
    if (isInvalid) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
  };
  const grow = () => { if (multiline) { input.style.height = "auto"; input.style.height = `${input.scrollHeight}px`; } };
  input.addEventListener("input", () => { grow(); sync(); });
  input.addEventListener("focus", () => { focused = true; sync(); });
  input.addEventListener("blur", () => { focused = false; sync(); });
  sync();

  let svg = null;
  let size = { width: 0, height: 0 };
  const measure = () => {
    const { width, height } = root.getBoundingClientRect();
    if (Math.abs(size.width - width) < 0.5 && Math.abs(size.height - height) < 0.5) return;
    size = { width, height };
    if (!width) return;
    if (!svg) {
      svg = document.createElementNS(SVG, "svg");
      svg.setAttribute("class", "seller-field__shape");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      svg.append(document.createElementNS(SVG, "path"));
      root.prepend(svg);
    }
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.firstChild.setAttribute("d", squirclePath(width, height));
  };
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(() => { measure(); }).observe(root);
  requestAnimationFrame(grow);

  return {
    el: root,
    input,
    setValue(text) { input.value = text; grow(); sync(); },
    setInvalid(value) { isInvalid = !!value; sync(); },
    setDisabled(value) { input.disabled = !!value; sync(); },
    // Playground only: shows the focused look without moving real focus (the React component has no such prop).
    setForcedFocus(value) { forcedFocus = !!value; sync(); },
  };
}
