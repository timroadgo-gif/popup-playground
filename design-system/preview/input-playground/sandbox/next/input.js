// Input (candidate, 2026-11-24) — the proposed next UI Kit field with a floating label. Spec: spec.md (same folder).
// createInput({ kind, label, ... }) → { el, control, value, setValue, setError, setSuccess, setDisabled, setReadOnly,
// validate, focus }. One component for eight kinds; formatting and validation are per kind, the look is shared.
import { createIcon } from "../../../../icons/icon.js?v=f7c37eca60bb";

export const INPUT_KINDS = ["text", "email", "tel", "number", "password", "textarea", "select", "search"];

const el = (tag, className, text) => {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text != null) n.textContent = text;
  return n;
};

// Native attributes per kind: the right keyboard, autofill and spell-checking for each.
const KIND_ATTRS = {
  text: { type: "text", autocapitalize: "sentences" },
  email: { type: "email", inputMode: "email", autocomplete: "email", autocapitalize: "none", spellcheck: false },
  tel: { type: "tel", inputMode: "tel", autocomplete: "tel" },
  number: { type: "text", inputMode: "numeric", autocomplete: "off" },
  password: { type: "password", autocomplete: "current-password", autocapitalize: "none", spellcheck: false },
  textarea: { autocapitalize: "sentences" },
  search: { type: "search", inputMode: "search", enterKeyHint: "search", autocomplete: "off" },
};

// ── Masks: the value is kept as digits and re-typeset; the caret is placed after the same number of digits ─────────
const NBSP = " ";
const MASKS = {
  // Russian numbers: +7 (912) 345-67-89. A leading 8 or 7 is read as the country code.
  tel: {
    start: 4, // digits are counted after «+7 («
    extract(raw) {
      let d = raw.replace(/\D/g, "");
      let prefix = false;
      if (raw.trimStart().startsWith("+7")) { d = d.slice(1); prefix = true; }
      else if (/^[78]/.test(d) && (d.length === 1 || d.length === 11)) { d = d.slice(1); prefix = true; }
      return { digits: d.slice(0, 10), stripped: prefix ? 1 : 0, prefix };
    },
    format(d, prefix) {
      if (!d) return prefix ? "+7 " : "";
      let out = `+7 (${d.slice(0, 3)}`;
      if (d.length > 3) out += `) ${d.slice(3, 6)}`;
      if (d.length > 6) out += `-${d.slice(6, 8)}`;
      if (d.length > 8) out += `-${d.slice(8, 10)}`;
      return out;
    },
  },
  // Whole roubles with thin grouping: 125 000.
  number: {
    start: 0,
    extract(raw) {
      const all = raw.replace(/\D/g, "");
      const d = all.replace(/^0+(?=\d)/, "").slice(0, 9);
      return { digits: d, stripped: all.length - all.replace(/^0+(?=\d)/, "").length, prefix: false };
    },
    format: (d) => d.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP),
  },
};
const caretAfterDigit = (text, k, start) => {
  if (k <= 0) return Math.min(start, text.length);
  let seen = 0;
  for (let i = start; i < text.length; i++) if (/\d/.test(text[i]) && ++seen === k) return i + 1;
  return text.length;
};

// ── Validation messages (Russian, short, say how to fix it) ─────────────────────────────────────────────────────────
const RULES = {
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? null : "Проверьте адрес: например, name@mail.ru"),
  tel: (v) => (v.replace(/\D/g, "").length === 11 ? null : "Введите номер полностью — 10 цифр после +7"),
  password: (v) => (v.length >= 8 ? null : "Пароль — не короче 8 символов"),
};

let uid = 0;

export function createInput({
  kind = "text",
  label,
  value = "",
  hint = "",
  helper = "",
  name,
  id,
  required = false,
  disabled = false,
  readOnly = false,
  autocomplete,
  maxLength,
  counter = false,
  options = [],
  suffix = "",
  min,
  successOnValid = false,
  validate: customValidate,
  requiredMessage = "Заполните поле",
  onInput,
} = {}) {
  if (!INPUT_KINDS.includes(kind)) throw new Error(`Input: kind "${kind}" is not one of ${INPUT_KINDS.join(" | ")}`);
  if (!label) throw new Error("Input: label is required (it is the accessible name and the placeholder)");

  const n = ++uid;
  const controlId = id ?? `ds-input-${n}`;
  const messageId = `ds-input-${n}-message`;
  const counterId = `ds-input-${n}-counter`;

  const wrap = el("div", "ds-input-field");
  wrap.dataset.kind = kind;
  const root = el("div", "ds-input ds-corner");
  root.dataset.kind = kind;
  const body = el("div", "ds-input__body");
  const labelEl = el("label", "ds-input__label", label);
  labelEl.htmlFor = controlId;
  labelEl.title = label;

  // Control
  let control;
  let valueEl = null;
  if (kind === "textarea") {
    control = el("textarea", "ds-input__control");
    control.rows = 2;
  } else if (kind === "select") {
    control = el("select", "ds-input__control");
    const empty = el("option", null, label);
    empty.value = "";
    empty.disabled = true;
    empty.hidden = true;
    control.append(empty);
    for (const o of options) {
      const opt = el("option", null, typeof o === "string" ? o : o.label);
      opt.value = typeof o === "string" ? o : o.value;
      control.append(opt);
    }
    valueEl = el("span", "ds-input__value");
    valueEl.setAttribute("aria-hidden", "true");
  } else {
    control = el("input", "ds-input__control");
  }
  control.id = controlId;
  if (name) control.name = name;
  if (kind !== "select") {
    Object.assign(control, KIND_ATTRS[kind] ?? {});
    control.placeholder = hint || " "; // a non-empty placeholder keeps :placeholder-shown meaningful
    if (autocomplete) control.autocomplete = autocomplete;
    if (maxLength) control.maxLength = maxLength;
  }
  if (required) { control.required = true; control.setAttribute("aria-required", "true"); }

  body.append(labelEl);
  if (kind === "select") body.append(valueEl); else body.append(control);

  // Leading / trailing slots
  let leading = null;
  if (kind === "search") {
    leading = el("span", "ds-input__leading");
    leading.append(createIcon("search"));
  }
  const trailing = el("span", "ds-input__trailing");
  let suffixEl = null;
  if (suffix) {
    suffixEl = el("span", "ds-input__suffix", suffix);
    suffixEl.setAttribute("aria-hidden", "true");
  }
  const status = el("span", "ds-input__status");
  status.append(createIcon("check"));

  let action = null;
  if (kind === "password") {
    action = el("button", "ds-input__action ds-corner ds-text-body-s", "Показать");
    action.type = "button";
    action.setAttribute("aria-controls", controlId);
    action.setAttribute("aria-pressed", "false");
    action.addEventListener("mousedown", (e) => e.preventDefault()); // keep the caret in the field
    action.addEventListener("click", () => {
      const show = control.type === "password";
      const [s, e] = [control.selectionStart, control.selectionEnd];
      control.type = show ? "text" : "password";
      action.textContent = show ? "Скрыть" : "Показать";
      action.setAttribute("aria-pressed", String(show));
      if (document.activeElement === control && s != null) control.setSelectionRange(s, e);
    });
  } else if (kind === "search") {
    action = el("button", "ds-input__action ds-input__action--icon ds-corner");
    action.type = "button";
    action.setAttribute("aria-label", "Очистить");
    action.hidden = true;
    action.append(createIcon("close", { size: 20 }));
    action.addEventListener("mousedown", (e) => e.preventDefault());
    action.addEventListener("click", () => { setValue(""); control.focus(); control.dispatchEvent(new Event("input", { bubbles: true })); });
  }
  if (kind === "select") trailing.append(createIcon("chevron-down"));
  if (action) trailing.append(action);
  trailing.append(status);

  root.append(...[leading, body].filter(Boolean));
  if (suffixEl) root.append(suffixEl);
  root.append(trailing);
  if (kind === "select") root.append(control);

  // Message + counter
  const meta = el("div", "ds-input__meta");
  const clip = el("div", "ds-input__meta-clip");
  const row = el("div", "ds-input__meta-row");
  const message = el("p", "ds-input__message ds-text-caption");
  message.id = messageId;
  message.setAttribute("aria-live", "polite");
  row.append(message);
  let counterEl = null;
  if (counter && maxLength) {
    counterEl = el("span", "ds-input__counter ds-text-caption");
    counterEl.id = counterId;
    row.append(counterEl);
  }
  clip.append(row);
  meta.append(clip);
  wrap.append(root, meta);

  // ── State ───────────────────────────────────────────────────────────────────────────────────────────────────────
  let error = null;
  let success = false;
  let touched = false;
  const mask = MASKS[kind];

  function syncMeta() {
    const text = error ?? helper ?? "";
    message.textContent = text;
    if (error) message.dataset.tone = "error"; else delete message.dataset.tone;
    if (counterEl) counterEl.textContent = `${control.value.length}/${maxLength}`;
    wrap.toggleAttribute("data-meta", Boolean(text) || Boolean(counterEl));
    const described = [text ? messageId : null, counterEl ? counterId : null].filter(Boolean).join(" ");
    if (described) control.setAttribute("aria-describedby", described); else control.removeAttribute("aria-describedby");
  }
  function syncFilled() {
    const filled = control.value !== "";
    root.toggleAttribute("data-filled", filled);
    if (valueEl) valueEl.textContent = filled ? control.selectedOptions[0]?.textContent ?? "" : "";
    if (kind === "search" && action) action.hidden = !filled || control.disabled || control.readOnly;
    if (kind === "textarea") autosize();
  }
  function syncState() {
    if (error) root.dataset.state = "error";
    else if (success) root.dataset.state = "success";
    else delete root.dataset.state;
    if (error) control.setAttribute("aria-invalid", "true"); else control.removeAttribute("aria-invalid");
  }
  function autosize() {
    if (CSS.supports?.("field-sizing", "content")) { control.style.fieldSizing = "content"; return; }
    control.style.height = "auto";
    if (control.scrollHeight) control.style.height = `${control.scrollHeight}px`;
  }

  function applyMask() {
    if (!mask) return;
    const raw = control.value;
    const focused = document.activeElement === control;
    const caret = focused ? control.selectionStart ?? raw.length : raw.length;
    const { digits, stripped, prefix } = mask.extract(raw);
    const k = Math.max(0, raw.slice(0, caret).replace(/\D/g, "").length - stripped);
    const out = mask.format(digits, prefix);
    if (out !== raw) control.value = out;
    if (focused) { const p = caretAfterDigit(out, Math.min(k, digits.length), mask.start); control.setSelectionRange(p, p); }
  }
  // Deleting over «)», «-», a space or the «+7» prefix removes the neighbouring digit instead of getting stuck.
  if (mask) {
    control.addEventListener("beforeinput", (e) => {
      if (!/^delete(Content|Word)(Backward|Forward)$/.test(e.inputType)) return;
      const { selectionStart: s, selectionEnd: t, value: v } = control;
      if (s !== t) return; // a selection: let the browser delete it, the input handler re-formats
      const { digits, prefix } = mask.extract(v);
      const before = v.slice(0, s).replace(/\D/g, "").length - mask.extract(v).stripped;
      const k = e.inputType.endsWith("Backward") ? before - 1 : before;
      e.preventDefault();
      if (k < 0 || k >= digits.length) { if (e.inputType.endsWith("Backward") && digits.length === 0) { control.value = ""; afterInput(); } return; }
      const next = digits.slice(0, k) + digits.slice(k + 1);
      control.value = next ? mask.format(next, prefix) : "";
      const p = caretAfterDigit(control.value, k, mask.start);
      control.setSelectionRange(p, p);
      afterInput();
    });
  }

  function runValidation({ force = false } = {}) {
    const v = control.value;
    let msg = null;
    if (!v) msg = required && (force || error) ? requiredMessage : null; // a shown «fill it in» stays until filled
    else {
      msg = RULES[kind]?.(v) ?? null;
      if (!msg && kind === "number" && min != null && Number(v.replace(/\D/g, "")) < min) msg = `Не меньше ${MASKS.number.format(String(min))}${suffix ? ` ${suffix}` : ""}`;
      if (!msg && customValidate) msg = customValidate(v) ?? null;
    }
    error = msg;
    success = !msg && Boolean(v) && successOnValid;
    syncState();
    syncMeta();
    return !msg;
  }

  function afterInput() {
    syncFilled();
    if (error) runValidation(); // punish late, reward early: an error clears as soon as the value is fixed …
    else if (success) { success = false; syncState(); } // … and «success» waits for the next blur
    syncMeta();
    onInput?.(control.value);
  }
  control.addEventListener("input", () => { applyMask(); afterInput(); });
  control.addEventListener("change", () => { syncFilled(); if (kind === "select") { touched = true; runValidation(); } });
  control.addEventListener("blur", () => { touched = true; if (kind !== "select") runValidation(); });

  // Tapping anywhere on the field (padding, label, icons) focuses the control without a blur/focus flicker.
  root.addEventListener("mousedown", (e) => {
    if (kind === "select" || e.target === control || e.target.closest(".ds-input__action")) return;
    if (control.disabled) return;
    e.preventDefault();
    control.focus();
  });
  root.addEventListener("click", (e) => {
    if (kind === "select" || e.target === control || e.target.closest(".ds-input__action") || control.disabled) return;
    if (document.activeElement !== control) control.focus();
  });

  // ── API ─────────────────────────────────────────────────────────────────────────────────────────────────────────
  function setValue(next) {
    control.value = next ?? "";
    applyMask();
    syncFilled();
    syncMeta();
  }
  function setError(msg) { error = msg || null; if (error) success = false; syncState(); syncMeta(); }
  function setSuccess(on) { success = Boolean(on); if (success) error = null; syncState(); syncMeta(); }
  function setDisabled(on) {
    control.disabled = Boolean(on);
    root.toggleAttribute("data-disabled", Boolean(on));
    if (action) action.disabled = Boolean(on);
    syncFilled();
  }
  function setReadOnly(on) {
    if (kind === "select") control.disabled = Boolean(on); else control.readOnly = Boolean(on);
    root.toggleAttribute("data-readonly", Boolean(on));
    if (action && kind === "search") syncFilled();
  }

  setValue(value);
  if (disabled) setDisabled(true);
  if (readOnly) setReadOnly(true);
  if (kind === "textarea") requestAnimationFrame(autosize);

  return {
    el: wrap,
    root,
    control,
    get value() { return control.value; },
    get touched() { return touched; },
    setValue,
    setError,
    setSuccess,
    setDisabled,
    setReadOnly,
    validate: (opts) => runValidation(opts),
    focus: () => control.focus(),
  };
}
