// Price amount — simplified port of the pricing input in Desktop/Проект/Flow/src/SellerApplication.jsx (commit 5b93ff2):
// digits only, no leading zeros, ≤ 10 digits, groups of three separated by U+2004, placeholder «100 000», width = measured
// mirror text + 3 px, «₽» after the number, error «Укажите сумму выплаты» in an expanding slot.
// Not ported: the FlowText digit animation, caret restoration after re-format, paste parsing, keyboard accessory bar.
const GROUP = " ";
const PLACEHOLDER = `100${GROUP}000`;
const MAX_DIGITS = 10;
const format = (digits) => (digits ? Number(digits).toLocaleString("ru-RU").replace(/[\s  ]/g, GROUP) : "");

export function createAmountInput({ value = "", invalid = false, label = "Выплата на руки, в рублях" } = {}) {
  const wrap = document.createElement("div");
  wrap.className = "seller-price-content";
  const amount = document.createElement("div");
  const mirror = Object.assign(document.createElement("span"), { className: "seller-price-amount__mirror" });
  mirror.setAttribute("aria-hidden", "true");
  const field = Object.assign(document.createElement("span"), { className: "seller-price-amount__field" });
  const input = Object.assign(document.createElement("input"), { className: "seller-price-amount__input", type: "text", inputMode: "numeric", autocomplete: "off", enterKeyHint: "done", placeholder: PLACEHOLDER, pattern: "[0-9 ]*" });
  input.setAttribute("aria-label", label);
  const currency = Object.assign(document.createElement("span"), { className: "seller-price-amount__currency", textContent: "₽" });
  field.append(input);
  amount.append(mirror, field, currency);
  const slot = Object.assign(document.createElement("div"), { className: "seller-price-error-slot" });
  const error = Object.assign(document.createElement("p"), { className: "seller-price-error" });
  slot.append(error);
  wrap.append(amount, slot);

  let digits = String(value).replace(/\D/g, "").replace(/^0+/, "").slice(0, MAX_DIGITS);
  let isInvalid = invalid;
  const sync = () => {
    input.value = format(digits);
    mirror.textContent = input.value || PLACEHOLDER;
    amount.className = `seller-price-amount${digits ? "" : " is-empty"}${isInvalid ? " is-invalid" : ""}`;
    slot.classList.toggle("is-open", isInvalid);
    error.textContent = isInvalid ? "Укажите сумму выплаты" : "";
    if (isInvalid) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
    requestAnimationFrame(() => { const w = mirror.getBoundingClientRect().width; if (w) input.style.width = `${Math.ceil(w) + 3}px`; });
  };
  input.addEventListener("input", () => { digits = input.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, MAX_DIGITS); isInvalid = false; sync(); });
  sync();
  return {
    el: wrap,
    input,
    get value() { return digits; },
    setValue(next) { digits = String(next).replace(/\D/g, "").slice(0, MAX_DIGITS); sync(); },
    setInvalid(next) { isInvalid = !!next; sync(); },
  };
}
