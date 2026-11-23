// Input Components Playground — page logic. Components come ONLY from sandbox/ (copies); nothing here is imported by the
// app. Page tools: style source (sandbox / original), stage background, mobile column, slow motion, forced states.
import { createField, setFieldValue, setFieldError } from "./sandbox/ui-kit/field.js?v=5142bc3a314a";
import { createCheckbox } from "./sandbox/ui-kit/checkbox.js?v=5142bc3a314a";
import { createSellerChip } from "./sandbox/flow/seller-chip.js?v=5142bc3a314a";
import { createSellerTextField } from "./sandbox/flow/seller-text-field.js?v=5142bc3a314a";
import { createAmountInput } from "./sandbox/flow/amount-input.js?v=5142bc3a314a";
import { createIcon } from "../../icons/icon.js?v=5142bc3a314a";
import { nextInputSections } from "./next-section.js?v=5142bc3a314a";

const params = new URLSearchParams(location.search);
const app = document.getElementById("app");

// ── DOM helper ────────────────────────────────────────────────────────────────────────────────────────────────────
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs ?? {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "text") el.textContent = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat()) if (c != null && c !== false) el.append(c.el instanceof Node ? c.el : c);
  return el;
}
const btn = (label, onclick, attrs = {}) => h("button", { class: "ipg-btn", type: "button", onclick, ...attrs }, label);
const toggleBtn = (label, onchange, initial = false) => {
  const b = btn(label, () => { const next = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", String(next)); onchange(next); }, { "aria-pressed": String(initial) });
  return b;
};

// ── Forced pseudo-states ──────────────────────────────────────────────────────────────────────────────────────────
// Like Storybook's pseudo-states: every :focus / :focus-within / :focus-visible / :hover / :active rule of the loaded
// component sheets is duplicated with an attribute selector, so a state can be shown without real focus or a pointer.
// Rebuilt after each style-source switch, so it always mirrors the CSS that is actually loaded.
const FORCE = { focus: "data-pg-focus", hover: "data-pg-hover", active: "data-pg-active" };
const PSEUDO = [[/:focus-within\b/g, "[data-pg-focus]"], [/:focus-visible\b/g, "[data-pg-focus]"], [/:focus(?![\w-])/g, "[data-pg-focus]"], [/:hover\b/g, "[data-pg-hover]"], [/:active\b/g, "[data-pg-active]"]];
function forcedRules(rules) {
  const out = [];
  for (const r of rules) {
    if (r instanceof CSSStyleRule) {
      if (/:(focus|hover|active)/.test(r.selectorText)) out.push(`${PSEUDO.reduce((s, [re, to]) => s.replace(re, to), r.selectorText)}{${r.style.cssText}}`);
    } else if (r instanceof CSSMediaRule) {
      const inner = forcedRules(r.cssRules);
      if (inner.length) out.push(`@media ${r.conditionText}{${inner.join("")}}`);
    } else if (typeof CSSSupportsRule !== "undefined" && r instanceof CSSSupportsRule) {
      const inner = forcedRules(r.cssRules);
      if (inner.length) out.push(`@supports ${r.conditionText}{${inner.join("")}}`);
    }
  }
  return out;
}
function rebuildForced() {
  document.getElementById("pg-forced")?.remove();
  const css = [];
  for (const sheet of document.styleSheets) {
    if (!sheet.ownerNode?.hasAttribute?.("data-pg-component")) continue;
    try { css.push(...forcedRules(sheet.cssRules)); } catch { /* not loaded yet */ }
  }
  document.head.append(h("style", { id: "pg-forced" }, css.join("\n")));
}
function force(target, kind) {
  const el = target.el ?? target;
  const attr = FORCE[kind];
  el.setAttribute(attr, "");
  el.querySelectorAll("input, textarea, button").forEach((n) => n.setAttribute(attr, ""));
  return target;
}

// ── Style source: sandbox copies ↔ originals ──────────────────────────────────────────────────────────────────────
let source = params.get("source") === "original" ? "original" : "sandbox";
function setSource(mode) {
  source = mode;
  const links = [...document.querySelectorAll("link[data-pg-component]")];
  return Promise.all(links.map((link) => new Promise((resolve) => {
    const href = link.dataset[mode];
    if (link.getAttribute("href")?.split("?")[0] === href) return resolve();
    const next = link.cloneNode();
    next.href = href;
    next.onload = next.onerror = () => { link.remove(); resolve(); };
    link.after(next);
  }))).then(rebuildForced);
}

// ── Slow motion: every CSS transition that starts runs at the chosen rate ─────────────────────────────────────────
let rate = 1;
document.addEventListener("transitionrun", (event) => {
  if (rate === 1 || !event.target.getAnimations) return;
  for (const a of event.target.getAnimations()) if (typeof CSSTransition === "undefined" || a instanceof CSSTransition) a.playbackRate = rate;
}, true);

// ── Layout pieces ─────────────────────────────────────────────────────────────────────────────────────────────────
const NAV = [];
function section({ id, title, lead, sources = [], missing = [] }, ...body) {
  NAV.push({ id, title });
  return h("section", { class: "ipg-section", id },
    h("h2", { class: "ipg-section__title ds-text-heading-s" }, title),
    lead && h("p", { class: "ipg-section__lead ds-text-body-s" }, lead),
    sources.length > 0 && h("ul", { class: "ipg-sources ds-text-caption" }, sources.map(([label, path]) => h("li", {}, `${label}: `, h("code", {}, path)))),
    ...body,
    missing.length > 0 && h("div", { class: "ipg-missing ds-text-body-s" }, "Состояний нет в компоненте (не придумываем, отмечаем):", h("ul", {}, missing.map((m) => h("li", {}, m)))),
  );
}
const sub = (text) => h("h3", { class: "ipg-sub ds-text-overline" }, text);
const grid = (...cards) => h("div", { class: "ipg-grid" }, ...cards);
const gridWide = (...cards) => h("div", { class: "ipg-grid ipg-grid--wide" }, ...cards);
const flow = (...children) => h("div", { class: "seller-application-page is-ui-v2" }, ...children);
function state(label, content, note, stageClass = "") {
  return h("div", { class: "ipg-state" },
    h("p", { class: "ipg-state__label ds-text-caption" }, label),
    h("div", { class: `ipg-stage ${stageClass}`.trim() }, content),
    note && h("p", { class: "ipg-state__note ds-text-caption" }, note));
}
const controls = (...items) => h("div", { class: "ipg-controls" }, ...items);
// A field plus its message in one wrapper, as the Field spec asks for gap-based stacks.
const wrapField = (field) => h("div", { class: "ipg-field-wrap" }, field);

// ── UI Kit Field · text ───────────────────────────────────────────────────────────────────────────────────────────
function fieldWithError(opts, message) {
  const f = createField(opts);
  const w = wrapField(f);
  if (message) setFieldError(f, message);
  return w;
}
function textFieldSection() {
  const all = [];
  const track = (wrap) => { all.push(wrap.querySelector(".ds-field")); return wrap; };
  const helper = wrapField(createField({ label: "Почта", placeholder: "Ваша почта", type: "email" }));
  helper.append(h("p", { class: "ds-field-message ds-text-caption" }, "Пришлём подтверждение заявки на эту почту"));

  // Validation demo (mock rules): required name, email format, phone 10+ digits.
  const form = [
    { f: createField({ label: "Имя", placeholder: "Как к вам обращаться", autocomplete: "off" }), check: (v) => (v.trim() ? null : "Укажите имя") },
    { f: createField({ label: "Почта", placeholder: "Ваша почта", type: "email", autocomplete: "off" }), check: (v) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? null : "Проверьте адрес почты") },
    { f: createField({ label: "Номер телефона", placeholder: "+7 900 000-00-00", type: "tel", autocomplete: "off" }), check: (v) => (v.replace(/\D/g, "").length >= 10 ? null : "Введите номер полностью") },
  ];
  for (const item of form) {
    item.wrap = wrapField(item.f);
    item.input = item.f.querySelector("input");
    item.input.addEventListener("blur", () => setFieldError(item.f, item.check(item.input.value)));
    item.input.addEventListener("input", () => { if (item.f.dataset.state === "error") setFieldError(item.f, item.check(item.input.value)); });
  }

  return section({
    id: "field-text",
    title: "Field · текстовое поле (UI Kit)",
    lead: "createField({ kind: \"text\" }). Используется в Popup System и в UI Kit-превью. Состояния меняют только цвет и внутреннюю обводку, размер не меняется. Фокус и подобные состояния ниже включены принудительно, рядом есть живые поля.",
    sources: [["Оригинал", "design-system/components/field/{field.css, field.js, spec.md}"], ["Песочница", "preview/input-playground/sandbox/ui-kit/field.{css,js}"]],
    missing: ["Hover — в спецификации не описан", "Success / «проверено» — нет", "Loading (спиннер/скелетон в поле) — нет", "Кнопка очистки, иконка слева/справа у текстового поля — нет (иконка есть только у поиска во Flow)", "Счётчик символов, маска ввода (телефон, дата) — нет: в UI Kit тип tel/email влияет только на клавиатуру"],
  },
    sub("Состояния"),
    grid(
      state("Пусто, плейсхолдер", track(wrapField(createField({ label: "Почта", placeholder: "Ваша почта", type: "email" })))),
      state("Пусто, без плейсхолдера", track(wrapField(createField({ label: "Имя" })))),
      state("Заполнено", track(wrapField(createField({ label: "Имя", value: "Иван" })))),
      state("Фокус (принудительно)", track(wrapField(force(createField({ label: "Почта", placeholder: "Ваша почта" }), "focus")))),
      state("Фокус + заполнено (принудительно)", track(wrapField(force(createField({ label: "Имя", value: "Иван" }), "focus")))),
      state("Ошибка + сообщение", track(fieldWithError({ label: "Почта", value: "ivan@", type: "email" }, "Проверьте адрес почты"))),
      state("Ошибка + фокус", (() => { const w = fieldWithError({ label: "Почта", value: "ivan@", type: "email" }, "Проверьте адрес почты"); force(w.querySelector(".ds-field"), "focus"); all.push(w.querySelector(".ds-field")); return w; })()),
      state("Подсказка под полем", helper),
      state("Disabled, пусто", track(wrapField(createField({ label: "Модель", placeholder: "Сначала выберите бренд", disabled: true })))),
      state("Disabled, заполнено", track(wrapField(createField({ label: "Номер телефона", value: "+7 900 000-00-00", type: "tel", disabled: true })))),
      state("Read-only", track(wrapField(createField({ label: "Номер заявки", value: "SA-000000", readOnly: true })))),
      state("Read-only + фокус", track(wrapField(force(createField({ label: "Номер заявки", value: "SA-000000", readOnly: true }), "focus")))),
    ),
    sub("Типы ввода (клавиатура на телефоне)"),
    grid(
      state("type=email", wrapField(createField({ label: "Почта", placeholder: "name@example.com", type: "email" }))),
      state("type=tel", wrapField(createField({ label: "Номер телефона", placeholder: "+7 900 000-00-00", type: "tel" }))),
      state("Числовое (inputmode=numeric)", (() => { const f = createField({ label: "Год покупки", placeholder: "2024" }); f.querySelector("input").inputMode = "numeric"; return wrapField(f); })()),
    ),
    sub("Живая валидация (мок-правила): ошибка на blur, снимается при исправлении"),
    gridWide(state("Форма", h("div", { class: "ipg-row" }, form.map((i) => i.wrap)))),
    controls(
      btn("Проверить форму", () => form.forEach((i) => setFieldError(i.f, i.check(i.input.value)))),
      btn("Сбросить форму", () => form.forEach((i) => { i.input.value = ""; setFieldError(i.f, null); })),
      toggleBtn("Все поля секции — disabled", (on) => all.forEach((f) => { const i = f.querySelector("input"); if (i && !i.readOnly) i.disabled = on; })),
    ),
  );
}

// ── UI Kit Field · textarea ───────────────────────────────────────────────────────────────────────────────────────
function textareaField({ label, value = "", placeholder = "", disabled = false, readOnly = false }) {
  const area = h("textarea", { class: "ds-field__input ds-text-input", rows: "3", placeholder });
  area.value = value;
  area.disabled = disabled;
  area.readOnly = readOnly;
  return h("label", { class: "ds-field ds-corner", "data-kind": "text" }, h("span", { class: "ds-field__content" }, h("span", { class: "ds-field__label ds-text-caption" }, label), area));
}
function textareaSection() {
  const long = "Сумка в хорошем состоянии, есть небольшие потёртости на углах и следы носки на ручках. Полный комплект: пыльник, коробка, чек.";
  const err = textareaField({ label: "Комментарий", value: "ок" });
  const errWrap = wrapField(err);
  setFieldError(err, "Опишите состояние подробнее — хотя бы 20 символов");
  return section({
    id: "field-textarea",
    title: "Field · многострочное поле (UI Kit)",
    lead: "Та же Field с <textarea class=\"ds-field__input\"> (так указано в spec.md, фабрика createField textarea не создаёт). Высота растёт по содержимому (field-sizing: content, где браузер поддерживает).",
    sources: [["Оригинал", "design-system/components/field/field.css (textarea.ds-field__input)"], ["Песочница", "sandbox/ui-kit/field.css"]],
    missing: ["Счётчик символов / лимит — нет", "Hover, success, loading — нет", "В Safari до поддержки field-sizing поле не растёт само (используется rows)"],
  },
    grid(
      state("Пусто, плейсхолдер", wrapField(textareaField({ label: "Комментарий", placeholder: "Расскажите о состоянии лота" }))),
      state("Заполнено (длинный текст)", wrapField(textareaField({ label: "Комментарий", value: long }))),
      state("Фокус (принудительно)", wrapField(force(textareaField({ label: "Комментарий", value: long }), "focus"))),
      state("Ошибка + сообщение", errWrap),
      state("Disabled", wrapField(textareaField({ label: "Комментарий", value: long, disabled: true }))),
      state("Read-only", wrapField(textareaField({ label: "Комментарий", value: long, readOnly: true }))),
    ),
  );
}

// ── UI Kit Field · select ─────────────────────────────────────────────────────────────────────────────────────────
let openList = null;
function closeList() { openList?.remove(); openList = null; }
document.addEventListener("click", (e) => { if (openList && !openList.contains(e.target) && !e.target.closest?.("[data-pg-select]")) closeList(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeList(); });
function mockSelect(opts, options) {
  const field = createField({
    kind: "select",
    ...opts,
    onClick: () => {
      if (openList) { closeList(); return; }
      const r = field.getBoundingClientRect();
      openList = h("ul", { class: "ipg-mock-list ds-text-body-s", role: "listbox" },
        h("li", { class: "ipg-mock-list__note ds-text-caption" }, "Заглушка: в UI Kit нет компонента списка. В приложении select открывает шторку Popup System."),
        options.map((o) => h("li", {}, h("button", { type: "button", role: "option", onclick: () => { setFieldValue(field, o); setFieldError(field, null); field.setAttribute("aria-expanded", "false"); closeList(); field.focus(); } }, o))));
      openList.style.top = `${r.bottom + scrollY + 4}px`;
      openList.style.left = `${Math.min(r.left + scrollX, document.documentElement.clientWidth - 236)}px`;
      openList.style.width = `${Math.max(220, r.width)}px`;
      document.body.append(openList);
      field.setAttribute("aria-expanded", "true");
    },
  });
  field.dataset.pgSelect = "";
  return field;
}
function selectSection() {
  const categories = ["Сумки", "Обувь", "Аксессуары", "Украшения", "Одежда"];
  const errSelect = mockSelect({ label: "Категория", placeholder: "Выберите категорию" }, categories);
  const errWrap = wrapField(errSelect);
  setFieldError(errSelect, "Выберите категорию");
  return section({
    id: "field-select",
    title: "Field · выбор из списка (UI Kit)",
    lead: "createField({ kind: \"select\" }) — кнопка со значением и шевроном. Сам список в UI Kit не определён: его открывает вызывающий код (в приложении — шторка). Здесь по нажатию открывается простая заглушка, чтобы можно было выбрать значение.",
    sources: [["Оригинал", "design-system/components/field/field.{css,js}"], ["Песочница", "sandbox/ui-kit/field.{css,js}"]],
    missing: ["Сам выпадающий список / listbox — компонента нет", "Открытое состояние поля (aria-expanded) — без отдельного стиля", "Hover, success, loading — нет", "Поиск внутри списка — есть только как отдельный экран во Flow (бренд/модель)"],
  },
    grid(
      state("Плейсхолдер (интерактивно)", wrapField(mockSelect({ label: "Категория", placeholder: "Выберите категорию" }, categories))),
      state("Выбрано (интерактивно)", wrapField(mockSelect({ label: "Бренд и модель", value: "Hermès, Birkin 30" }, ["Hermès, Birkin 30", "Chanel, Classic Flap", "Loewe, Puzzle"]))),
      state("Нажатие (принудительно)", wrapField(force(createField({ kind: "select", label: "Категория", value: "Сумки" }), "active"))),
      state("Фокус (принудительно)", wrapField(force(createField({ kind: "select", label: "Категория", value: "Сумки" }), "focus"))),
      state("Ошибка + сообщение", errWrap),
      state("Disabled", wrapField(createField({ kind: "select", label: "Модель", placeholder: "Сначала выберите бренд", disabled: true }))),
      state("Read-only (без шеврона, не кнопка)", wrapField(createField({ kind: "select", label: "Категория", value: "Сумки", readOnly: true }))),
      state("Длинное значение", wrapField(mockSelect({ label: "Бренд и модель", value: "Louis Vuitton, Pochette Métis East West Monogram Reverse" }, ["Louis Vuitton, Pochette Métis East West Monogram Reverse"]))),
    ),
  );
}

// ── Flow · search ─────────────────────────────────────────────────────────────────────────────────────────────────
function searchField({ placeholder = "Поиск бренда", value = "", disabled = false } = {}) {
  const input = h("input", { class: "ds-field__input ds-text-input", type: "search", enterkeyhint: "search", autocomplete: "off", placeholder });
  input.value = value;
  input.disabled = disabled;
  return h("label", { class: "seller-ps-search ds-field ds-corner", "data-kind": "text" },
    h("span", { class: "seller-ps-sr-only" }, placeholder),
    h("span", { class: "seller-ds-slot" }, createIcon("search", { size: 20 })),
    input);
}
function searchSection() {
  const brands = ["Hermès", "The Row", "Celine", "Chanel", "Gucci", "Louis Vuitton", "Saint Laurent", "Loewe", "Bottega Veneta"];
  const live = searchField();
  const out = h("p", { class: "ipg-log ds-text-caption" });
  const update = () => { const q = live.querySelector("input").value.trim().toLowerCase(); const found = brands.filter((b) => b.toLowerCase().includes(q)); out.textContent = q ? (found.length ? `Найдено: ${found.join(", ")}` : "Ничего не найдено (в приложении — своё пустое состояние списка)") : `Мок-список: ${brands.length} брендов`; };
  live.querySelector("input").addEventListener("input", update);
  update();
  return section({
    id: "flow-search",
    title: "Поиск (Flow · бренд и модель)",
    lead: "Разметка UI Kit Field + стили Flow (visual-v2 §4): светлая заливка, иконка search, 48 px, крестик очистки нарисован поверх нативного.",
    sources: [["Оригинал", "Flow: src/visual-v2.css §4, src/SellerApplication.jsx (.seller-ps-search)"], ["Снимок оригинала", "preview/input-playground/reference/flow/search-field.css"], ["Песочница", "sandbox/flow/search-field.css"]],
    missing: ["Ошибка — нет", "Loading (идёт поиск) — нет", "Hover — нет", "Read-only — не применяется"],
  },
    grid(
      state("Пусто, плейсхолдер", flow(searchField())),
      state("Заполнено (крестик очистки)", flow(searchField({ value: "Hermès" }))),
      state("Фокус (принудительно)", flow(force(searchField(), "focus"))),
      state("Фокус + заполнено (принудительно)", flow(force(searchField({ value: "Louis Vuitton" }), "focus"))),
      state("Disabled", flow(searchField({ disabled: true }))),
      state("Длинный запрос", flow(searchField({ value: "Louis Vuitton Pochette Métis East West Monogram Reverse" }))),
    ),
    gridWide(state("Живой поиск по мок-списку", flow(live, out))),
  );
}

// ── Flow · SellerTextField ────────────────────────────────────────────────────────────────────────────────────────
function sellerFieldSection() {
  const all = [];
  const t = (opts, after) => { const f = createSellerTextField(opts); all.push(f); after?.(f); return f; };
  return section({
    id: "flow-text-field",
    title: "Текстовое поле Flow (контакты заявки)",
    lead: "SellerTextField (Figma «Работа» 696:5183): белое поле 78 px, суперэллипс r16, подпись лежит в строке значения и поднимается при фокусе или вводе. Используется для имени, фамилии, почты, телефона и Telegram на шаге контактов.",
    sources: [["Оригинал", "Flow: src/SellerTextField.jsx + src/seller-text-field.css"], ["Снимок оригинала", "reference/flow/seller-text-field.css"], ["Песочница", "sandbox/flow/seller-text-field.{css,js} (порт React → JS)"]],
    missing: ["Текст ошибки под полем — нет (только красная обводка)", "Read-only — нет отдельного стиля", "Плейсхолдер — скрыт намеренно (роль плейсхолдера у подписи)", "Hover, success, loading — нет", "Маска телефона — нет (обычный type=tel)"],
  },
    sub("Состояния"),
    grid(
      state("Пусто (подпись в строке значения)", flow(t({ label: "Имя", autocomplete: "off" }))),
      state("Фокус, пусто (принудительно)", flow(t({ label: "Имя" }, (f) => f.setForcedFocus(true)))),
      state("Заполнено", flow(t({ label: "Фамилия", value: "Петров" }))),
      state("Фокус + заполнено (принудительно)", flow(t({ label: "Фамилия", value: "Петров" }, (f) => f.setForcedFocus(true)))),
      state("Ошибка", flow(t({ label: "Почта", value: "ivan@", type: "email", invalid: true }))),
      state("Ошибка, пусто", flow(t({ label: "Номер телефона", type: "tel", invalid: true }))),
      state("Disabled, пусто", flow(t({ label: "Ник в телеграмм", disabled: true }))),
      state("Disabled, заполнено", flow(t({ label: "Почта", value: "ivan@example.com", disabled: true }))),
      state("Read-only (нет своего стиля)", flow(t({ label: "Имя", value: "Иван", readOnly: true }))),
      state("Многострочное (растёт при вводе)", flow(t({ label: "Комментарий", multiline: true }))),
    ),
    sub("Типы ввода"),
    grid(
      state("Почта (type=email)", flow(t({ label: "Почта", type: "email", autocomplete: "off" }))),
      state("Телефон (type=tel)", flow(t({ label: "Номер телефона", type: "tel", autocomplete: "off" }))),
      state("Число (inputmode=numeric)", flow(t({ label: "Год покупки", inputMode: "numeric", autocomplete: "off" }))),
    ),
    controls(
      toggleBtn("Ошибка у всех", (on) => all.forEach((f) => f.setInvalid(on))),
      toggleBtn("Все disabled", (on) => all.forEach((f) => f.setDisabled(on))),
      btn("Очистить все", () => all.forEach((f) => f.setValue(""))),
    ),
  );
}

// ── Flow · amount ─────────────────────────────────────────────────────────────────────────────────────────────────
function amountSection() {
  const live = createAmountInput();
  return section({
    id: "flow-amount",
    title: "Сумма (Flow · шаг цены)",
    lead: "Крупное числовое поле по центру: только цифры, разряды через узкий пробел, ширина подстраивается под текст, «₽» после числа. Ошибка «Укажите сумму выплаты» раскрывается под полем.",
    sources: [["Оригинал", "Flow: src/styles.css (.seller-price-amount*), SellerApplication.jsx (pricing)"], ["Снимок оригинала", "reference/flow/amount-input.css"], ["Песочница", "sandbox/flow/amount-input.{css,js}"]],
    missing: ["Анимация цифр FlowText — в песочницу не перенесена (во Flow цифры рисует оверлей)", "Отдельный стиль фокуса — нет (только каретка)", "Disabled, read-only, hover, success, loading — нет"],
  },
    grid(
      state("Пусто, плейсхолдер «100 000»", flow(createAmountInput())),
      state("Заполнено", flow(createAmountInput({ value: "250000" }))),
      state("Ошибка (пусто)", flow(createAmountInput({ invalid: true }))),
      state("Длинное значение (10 цифр)", flow(createAmountInput({ value: "9999999999" }))),
    ),
    gridWide(state("Живое поле", flow(live))),
    controls(btn("Проверить (пусто → ошибка)", () => live.setInvalid(!live.value)), btn("Сбросить", () => { live.setValue(""); live.setInvalid(false); })),
  );
}

// ── Checkboxes & radio ────────────────────────────────────────────────────────────────────────────────────────────
function purchasedRow(checked = false) {
  const input = h("input", { class: "ds-checkbox__input", type: "checkbox" });
  input.checked = checked;
  return h("label", { class: "seller-details-purchased ds-checkbox" },
    h("span", { class: "seller-details-purchased__title" }, "Лот был куплен в THE CULTT"),
    input,
    h("span", { class: "seller-details-check ds-checkbox__box", "aria-hidden": "true" }, h("span", { class: "seller-ds-slot" }, createIcon("check", { size: 14 }))));
}
function radioGroup(selected = null, label = "Раздел каталога") {
  const items = [{ id: "women", label: "Женский каталог" }, { id: "men", label: "Мужской каталог" }];
  const group = h("div", { class: "seller-ps-list seller-ps-list--plain", role: "radiogroup", "aria-label": label });
  const rows = items.map((it) => {
    const row = h("button", { class: "seller-ps-row", type: "button", role: "radio", "aria-checked": String(it.id === selected) },
      h("span", { class: "seller-ps-row__copy" }, h("span", { class: "ds-text-body" }, it.label)),
      h("span", { class: "seller-ps-radio", "aria-hidden": "true" }));
    row.addEventListener("click", () => rows.forEach((r) => r.setAttribute("aria-checked", String(r === row))));
    return row;
  });
  group.append(...rows);
  return group;
}
function checkSection() {
  const longLabel = "Я принимаю условия Публичной оферты и согласен (-а) на обработку своих персональных данных";
  return section({
    id: "checks",
    title: "Чекбоксы и радио",
    lead: "UI Kit Checkbox (согласия в попапах), строка-чекбокс Flow «Лот был куплен в THE CULTT» (анатомия UI Kit, своя коробка 20 px) и радио-строки попапа «Для кого предназначен лот?».",
    sources: [["UI Kit", "design-system/components/checkbox/ → sandbox/ui-kit/checkbox.{css,js}"], ["Flow чекбокс", "src/styles.css → sandbox/flow/checkbox-row.css"], ["Flow радио", "src/styles.css → sandbox/flow/radio-row.css"]],
    missing: ["Checkbox: disabled, ошибка, indeterminate — в spec.md «Not defined — needs design approval»", "Строка-чекбокс Flow: disabled, ошибка — нет", "Радио: disabled, ошибка — нет; радио-компонента в UI Kit нет (Flow рисует своё)", "Hover — нигде нет"],
  },
    sub("Checkbox · UI Kit"),
    grid(
      state("Не отмечен", createCheckbox({ label: "Согласен (-а) на получение рекламной рассылки" })),
      state("Отмечен", createCheckbox({ label: "Согласен (-а) на получение рекламной рассылки", checked: true })),
      state("Фокус с клавиатуры (принудительно)", force(createCheckbox({ label: "Согласен (-а) на получение рекламной рассылки" }), "focus")),
      state("Длинная подпись (перенос)", createCheckbox({ label: longLabel })),
    ),
    sub("Строка-чекбокс · Flow"),
    grid(
      state("Не отмечен", flow(purchasedRow(false))),
      state("Отмечен", flow(purchasedRow(true))),
      state("Фокус с клавиатуры (принудительно)", flow(force(purchasedRow(false), "focus"))),
    ),
    sub("Радио-строки · Flow (интерактивно)"),
    grid(
      state("Ничего не выбрано", flow(radioGroup(null))),
      state("Выбрано", flow(radioGroup("women"))),
      state("Фокус с клавиатуры (принудительно)", flow((() => { const g = radioGroup("men"); force(g.querySelector(".seller-ps-row"), "focus"); return g; })())),
    ),
  );
}

// ── Chips ─────────────────────────────────────────────────────────────────────────────────────────────────────────
const CONDITION = ["Хорошее", "Отличное", "Новое"];
const NUANCES = ["Ткань", "Кожа", "Фурнитура", "Износ ручки", "Царапины по углам"];
const INCLUDES = ["Нет аксессуаров", "Пыльник", "Коробка", "Ремень", "Ключница", "Замок", "Колокольчик"];

// The three groups exactly as on «Детали лота» (same selection rules and validation messages as SellerApplication.jsx).
function detailsGroups(log) {
  let condition = null;
  let wear = [];
  let includes = [];
  let attempted = false;
  const condErr = h("p", { class: "seller-details-error", role: "alert" }, "Выберите состояние лота");
  const wearErr = h("p", { class: "seller-details-error", role: "alert" }, "Выберите хотя бы один нюанс");
  const wearSection = h("section", { class: "seller-details-chip-section seller-details-wear" });
  const condChips = CONDITION.map((item) => createSellerChip({ label: item, onClick: () => { condition = item; attempted = false; sync(); log(`Состояние лота: ${item} (одиночный выбор, повторное нажатие не снимает)`); } }));
  const wearChips = NUANCES.map((item) => createSellerChip({ label: item, onClick: () => { wear = wear.includes(item) ? wear.filter((v) => v !== item) : [...wear, item]; attempted = false; sync(); log(`Нюансы: ${wear.join(", ") || "—"}`); } }));
  const incChips = INCLUDES.map((item) => createSellerChip({ label: item, onClick: () => {
    const active = includes.includes(item);
    includes = item === "Нет аксессуаров" ? (active ? [] : ["Нет аксессуаров"]) : active ? includes.filter((v) => v !== item) : [...includes.filter((v) => v !== "Нет аксессуаров"), item];
    sync(); log(`Комплектация: ${includes.join(", ") || "—"} («Нет аксессуаров» снимает остальные и наоборот)`);
  } }));
  function sync() {
    condChips.forEach((c, i) => c.setSelected(condition === CONDITION[i]));
    wearChips.forEach((c, i) => c.setSelected(wear.includes(NUANCES[i])));
    incChips.forEach((c, i) => c.setSelected(includes.includes(INCLUDES[i])));
    condErr.hidden = !(attempted && !condition);
    const wearMissing = attempted && condition === "Хорошее" && wear.length === 0;
    wearErr.hidden = !wearMissing;
    wearSection.classList.toggle("has-error", wearMissing);
  }
  wearSection.append(h("h3", {}, "Выбрать нюансы"), h("div", { class: "seller-details-chips" }, wearChips), wearErr);
  const root = h("div", { class: "seller-details-stack" },
    h("section", { class: "seller-details-condition-group" },
      h("h2", {}, "Состояние лота"),
      h("div", { class: "seller-details-condition", role: "group", "aria-label": "Состояние лота" }, condChips),
      condErr,
      h("div", { class: "seller-details-wear-wrap" }, wearSection)),
    h("section", { class: "seller-details-chip-section seller-details-includes", style: "margin-top: 32px" },
      h("h2", {}, "Комплектация"),
      h("div", { class: "seller-details-chips" }, incChips)));
  sync();
  return {
    root,
    validate() { attempted = true; sync(); log(!condition ? "Проверка: не выбрано состояние" : condition === "Хорошее" && !wear.length ? "Проверка: для «Хорошее» нужен хотя бы один нюанс" : "Проверка пройдена"); },
    reset() { condition = null; wear = []; includes = []; attempted = false; sync(); log("Сброшено"); },
    selectAll() { condition = "Новое"; wear = [...NUANCES]; includes = INCLUDES.slice(1); sync(); log("Выбрано всё"); },
  };
}
const chipRow = (labels, { selected = [], container = "seller-details-chips", disabled = false } = {}) =>
  h("div", { class: container }, labels.map((l) => { const c = createSellerChip({ label: l, selected: selected.includes(l), disabled, onClick: (api) => api.setSelected(!api.selected) }); return c; }));

function chipsSection() {
  const log = h("p", { class: "ipg-log ds-text-caption", "aria-live": "polite" }, "Нажимайте чипсы — здесь появится, что выбрано.");
  const groups = detailsGroups((text) => { log.textContent = text; });

  // Animation demo: one chip toggled by buttons, plus a staggered wave.
  const demo = createSellerChip({ label: "Фурнитура", onClick: (api) => api.setSelected(!api.selected) });
  const wave = NUANCES.map((l) => createSellerChip({ label: l, onClick: (api) => api.setSelected(!api.selected) }));
  const waveRun = (on) => wave.forEach((c, i) => setTimeout(() => c.setSelected(on), i * 90));

  // Width playground for wrapping.
  const widthStage = h("div", { class: "ipg-stage", style: "width: 320px; max-width: 100%" }, flow(chipRow([...NUANCES, ...INCLUDES], { selected: ["Кожа", "Коробка"] })));
  const range = h("input", { type: "range", min: "200", max: "720", value: "320", oninput: (e) => { widthStage.style.width = `${e.target.value}px`; rangeOut.textContent = `${e.target.value} px`; } });
  const rangeOut = h("span", {}, "320 px");

  const pressed = createSellerChip({ label: "Отличное" });
  force(pressed, "active");
  const focused = createSellerChip({ label: "Кожа" });
  force(focused, "focus");
  const focusedSel = createSellerChip({ label: "Кожа", selected: true });
  force(focusedSel, "focus");

  return section({
    id: "chips",
    title: "Чипсы (Flow · «Детали лота»)",
    lead: "SellerChip — последняя версия из проекта (2026-11-23): пилюля 32 px, 13/18, выбранный = светло-серая заливка + тонкая обводка, которая прорисовывается по часовой от верхней точки за 480 мс и так же убирается; заливка — 240 мс. Невидимая зона нажатия 44 px. Одинаковый компонент для всех трёх групп, отличается только логика выбора.",
    sources: [["Оригинал", "Flow: src/SellerChip.jsx + src/visual-v2.css §5, §7, §8 (+ база в src/styles.css)"], ["Снимок оригинала", "reference/flow/seller-chip.css"], ["Песочница", "sandbox/flow/seller-chip.{css,js}"]],
    missing: ["Hover — нет", "Фокус с клавиатуры — есть только старое зелёное кольцо из базовых стилей (rgb 40, 81, 65), в v2 не переопределено", "Нажатие (scale .985) — только у «Состояние лота», у остальных групп нет", "Disabled (opacity .4) есть в CSS, но в заявке не используется", "Ошибка — только текстом под группой, сам чипс не меняется", "Известная особенность оригинала: при появлении чипсов на экране их обводка один раз мелькает (≈0,5 с) — transition stroke-dashoffset стартует с запасного значения 400. В песочнице поведение сохранено один в один"],
  },
    sub("Как в заявке: три группы с настоящей логикой"),
    gridWide(state("«Состояние лота» — один из трёх · «Выбрать нюансы» — несколько · «Комплектация» — несколько, «Нет аксессуаров» исключает остальные", flow(groups.root, log))),
    controls(btn("Продолжить (проверка)", () => groups.validate()), btn("Выбрать всё", () => groups.selectAll()), btn("Сбросить", () => groups.reset())),

    sub("Состояния"),
    grid(
      state("Не выбран", flow(chipRow(["Пыльник"]))),
      state("Выбран", flow(chipRow(["Пыльник"], { selected: ["Пыльник"] }))),
      state("Нажатие (принудительно; только «Состояние лота»)", flow(h("div", { class: "seller-details-condition" }, pressed))),
      state("Фокус с клавиатуры (принудительно)", flow(h("div", { class: "seller-details-chips" }, focused, focusedSel))),
      state("Disabled (не выбран / выбран)", flow(chipRow(["Ключница", "Замок"], { selected: ["Замок"], disabled: true }))),
      state("Ошибка группы", flow(chipRow(["Ткань", "Кожа"]), h("p", { class: "seller-details-error" }, "Выберите хотя бы один нюанс"))),
    ),

    sub("Анимация выбора и снятия"),
    grid(
      state("Один чипс", flow(h("div", { class: "seller-details-chips" }, demo)), "Для разглядывания включите «Анимации ×0,2» в панели сверху."),
      state("Волна (по очереди)", flow(h("div", { class: "seller-details-chips" }, wave))),
    ),
    controls(btn("Выбрать", () => demo.setSelected(true)), btn("Снять", () => demo.setSelected(false)), btn("Волна: выбрать", () => waveRun(true)), btn("Волна: снять", () => waveRun(false))),

    sub("Одиночный и множественный выбор"),
    grid(
      state("Одиночный (как «Состояние лота»)", flow((() => { const chips = CONDITION.map((l) => createSellerChip({ label: l, onClick: (api) => chips.forEach((c) => c.setSelected(c === api)) })); return h("div", { class: "seller-details-condition" }, chips); })())),
      state("Множественный (как «Выбрать нюансы»)", flow(chipRow(NUANCES))),
    ),

    sub("Длина подписей"),
    grid(
      state("Короткие", flow(chipRow(["Ткань", "Кожа", "Замок"]))),
      state("Длинные", flow(chipRow(["Царапины по углам", "Следы носки на подкладке", "Потёртости на ручках и ремне"], { selected: ["Следы носки на подкладке"] }))),
      state("Очень длинная (без переноса строки)", flow(chipRow(["Потёртости на углах, следы носки на подкладке и небольшое пятно на дне"])), "white-space: nowrap — на узком экране выходит за край."),
    ),

    sub("Ряды и перенос"),
    grid(
      state("Несколько в один ряд", flow(chipRow(CONDITION, { container: "seller-details-condition", selected: ["Отличное"] }))),
      state("Перенос на несколько рядов", flow(chipRow(INCLUDES, { selected: ["Пыльник", "Коробка"] }))),
    ),
    h("div", { class: "ipg-controls" }, h("label", { class: "ipg-range ds-text-caption" }, "Ширина контейнера", range, rangeOut)),
    widthStage,
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────────────────────────────────────────
function layoutSection() {
  const uk = (label, value, extra = {}) => wrapField(createField({ label, value, placeholder: extra.placeholder ?? "", ...extra }));
  const sf = (label, value = "") => createSellerTextField({ label, value });
  const longLabel = "Адрес регистрации по месту жительства, как указано в паспорте";
  const longValue = "Константинопольская-Ленинградская Александра Владиславовна";
  const kit = (stageClass) => h("div", { class: `ipg-stage ${stageClass}` },
    uk("Почта", "ivan@example.com"),
    wrapField(createField({ kind: "select", label: "Категория", value: "Сумки" })),
    flow(sf("Имя", "Иван"), searchField(), chipRow(["Хорошее", "Отличное", "Новое"], { selected: ["Отличное"] }), purchasedRow(true)));
  return section({
    id: "layout",
    title: "Раскладка и фон",
    lead: "Поля во всю ширину, по два и по три в ряд, длинные подписи и значения, белый и светло-серый фон. Ряды не перестраиваются на телефоне специально — видно, как поля сжимаются. Переключите «Колонка 375» сверху.",
    sources: [["UI Kit", "sandbox/ui-kit/field.*"], ["Flow", "sandbox/flow/seller-text-field.*"]],
  },
    sub("Во всю ширину"),
    gridWide(state("UI Kit Field", uk("Почта", "ivan@example.com")), state("Поле Flow", flow(sf("Почта", "ivan@example.com"))), state("Поиск Flow", flow(searchField()))),
    sub("Два в ряд"),
    gridWide(
      state("UI Kit Field", h("div", { class: "ipg-row ipg-row--2" }, uk("Имя", "Иван"), uk("Фамилия", "Петров"))),
      state("Поле Flow", flow(h("div", { class: "ipg-row ipg-row--2" }, sf("Имя", "Иван"), sf("Фамилия")))),
    ),
    sub("Три в ряд"),
    gridWide(
      state("UI Kit Field", h("div", { class: "ipg-row ipg-row--3" }, uk("Фамилия", "Петров"), uk("Имя", "Иван"), uk("Отчество", "", { placeholder: "Необязательно" }))),
      state("Поле Flow", flow(h("div", { class: "ipg-row ipg-row--3" }, sf("Фамилия", "Петров"), sf("Имя", "Иван"), sf("Отчество")))),
    ),
    sub("Длинные подписи, плейсхолдеры и значения"),
    gridWide(
      state("UI Kit Field", h("div", { class: "ipg-row" }, uk(longLabel, "", { placeholder: "Город, улица, дом, квартира — как в паспорте, без сокращений" }), uk("ФИО", longValue), uk("Почта", "konstantinopolskaya.leningradskaya.alexandra@example.com"))),
      state("Поле Flow", flow(h("div", { class: "ipg-row" }, sf(longLabel), sf("ФИО", longValue), sf("Почта", "konstantinopolskaya.leningradskaya.alexandra@example.com")))),
    ),
    sub("Белый и светло-серый фон рядом"),
    h("div", { class: "ipg-pair" },
      h("div", { class: "ipg-state" }, h("p", { class: "ipg-state__label ds-text-caption" }, "Белый"), kit("ipg-stage--white")),
      h("div", { class: "ipg-state" }, h("p", { class: "ipg-state__label ds-text-caption" }, "Светло-серый (grey-1)"), kit("ipg-stage--grey"))),
  );
}

// ── Summary ───────────────────────────────────────────────────────────────────────────────────────────────────────
const COLS = ["Пусто / плейсх.", "Заполнено", "Фокус", "Hover", "Нажатие", "Выбрано", "Disabled", "Read-only", "Ошибка", "Успех", "Загрузка"];
const Y = "есть", N = "нет", NA = "—";
const MATRIX = [
  ["Input · кандидат (8 видов)", "метка = плейсх.", Y, Y, "мышь", NA, NA, Y, Y, Y, "почта, телефон", N],
  ["Field · текст (UI Kit)", Y, Y, Y, N, NA, NA, Y, Y, Y, N, N],
  ["Field · textarea (UI Kit)", Y, Y, Y, N, NA, NA, Y, Y, Y, N, N],
  ["Field · select (UI Kit)", Y, Y, Y, N, Y, NA, Y, Y, Y, N, N],
  ["Поиск (Flow)", Y, Y, Y, N, NA, NA, Y, NA, N, N, N],
  ["Текстовое поле (Flow)", "подпись вместо плейсх.", Y, Y, N, NA, NA, Y, N, "только обводка", N, N],
  ["Сумма (Flow)", Y, Y, "только каретка", N, NA, NA, N, N, Y, N, N],
  ["Checkbox (UI Kit)", NA, NA, "клавиатура", N, NA, Y, N, NA, N, N, NA],
  ["Строка-чекбокс (Flow)", NA, NA, "клавиатура", N, NA, Y, N, NA, N, N, NA],
  ["Радио-строки (Flow)", NA, NA, "клавиатура", N, N, Y, N, NA, N, N, NA],
  ["Чипсы (Flow)", NA, NA, "старое зелёное кольцо", N, "только «Состояние»", Y, "в CSS, не используется", NA, "текст под группой", N, NA],
];
function summarySection() {
  const cls = (v) => (v === Y ? "yes" : v === N ? "no" : v === NA ? "na" : "yes");
  return section({ id: "summary", title: "Сводка: какие состояния есть", lead: "«есть» — состояние определено в стилях компонента; «нет» — не определено (дизайн нужно придумать); «—» — к компоненту не относится." },
    h("div", { class: "ipg-table-wrap" }, h("table", { class: "ipg-table ds-text-body-s" },
      h("thead", {}, h("tr", {}, h("th", {}, "Компонент"), COLS.map((c) => h("th", {}, c)))),
      h("tbody", {}, MATRIX.map(([name, ...vals]) => h("tr", {}, h("td", {}, name), vals.map((v) => h("td", { "data-v": cls(v) }, v))))))),
    sub("Типов полей нет в проекте (UI Kit + Flow)"),
    h("ul", { class: "ipg-list ds-text-body-s" },
      h("li", {}, "Выпадающий список / listbox — select открывает внешний список, своего компонента нет."),
      h("li", {}, "Переключатель (Switch), радио как компонент UI Kit, поле пароля с показом, телефон с маской и кодом страны, дата с маской, поле с подсказками адреса."),
      h("li", {}, "Они есть в коде боевого сайта (прототип форм frontend-next: Input, Select, Radio, Switch, PhoneInput, DaData) — это другой проект, сюда не перенесены."),
      h("li", {}, "Загрузка фото во Flow — плитка, открывающая системный выбор файлов, а не поле ввода; в песочницу не вынесена.")),
    sub("Что можно править при редизайне"),
    h("ul", { class: "ipg-list ds-text-body-s" },
      h("li", {}, h("code", {}, "preview/input-playground/sandbox/**"), " — копии компонентов: CSS и JS. Правки видны только на этой странице."),
      h("li", {}, h("code", {}, "preview/input-playground/{playground.js, playground.css, index.html}"), " — сама страница: примеры, состояния, панель."),
      h("li", {}, "Не трогать: ", h("code", {}, "reference/flow/*"), " (снимок оригинала для сравнения), ", h("code", {}, "design-system/components/*"), ", ", h("code", {}, "tokens/*"), ", Flow ", h("code", {}, "src/*"), " — пока решения не утверждены.")),
  );
}

// ── Chips · selected-state variants (experiment) ─────────────────────────────────────────────────────────────────
// Three treatments of the selected chip, side by side: same component (SellerChip), same geometry, type, spacing and
// selection logic; only sandbox/flow/seller-chip-variants.css differs per variant. Rows = scenarios, columns = variants.
const CHIP_VARIANTS = [
  ["a", "A · зелёная обводка + лёгкий зелёный тон"],
  ["b", "B · зелёная обводка + белый фон"],
  ["c", "C · зелёная обводка, фон не меняется"],
];
const flowVar = (v, ...children) => h("div", { class: `seller-application-page is-ui-v2 chip-var chip-var--${v}`, "data-chip-variant": v }, ...children);
const chipCaption = (text) => h("p", { class: "ipg-state__note ds-text-caption" }, text);

function singleGroup(labels, initial = null) {
  let current = initial;
  const chips = labels.map((l) => createSellerChip({ label: l, selected: l === initial, onClick: () => { current = l; chips.forEach((c, i) => c.setSelected(labels[i] === current)); } }));
  return h("div", { class: "seller-details-condition", role: "group" }, chips);
}
function includesGroup(initial = []) {
  let includes = [...initial];
  const chips = INCLUDES.map((item) => createSellerChip({ label: item, selected: includes.includes(item), onClick: () => {
    const active = includes.includes(item);
    includes = item === "Нет аксессуаров" ? (active ? [] : ["Нет аксессуаров"]) : active ? includes.filter((v) => v !== item) : [...includes.filter((v) => v !== "Нет аксессуаров"), item];
    chips.forEach((c, i) => c.setSelected(includes.includes(INCLUDES[i])));
  } }));
  return h("div", { class: "seller-details-chips" }, chips);
}

function chipVariantsSection() {
  const row = (build, note) => grid(...CHIP_VARIANTS.map(([v, label]) => state(label, flowVar(v, build(v)), note)));
  // Animation: the same chip in every variant, toggled together so the transitions can be compared frame by frame.
  const demos = CHIP_VARIANTS.map(() => createSellerChip({ label: "Фурнитура", onClick: (api) => api.setSelected(!api.selected) }));
  const waves = CHIP_VARIANTS.map(() => NUANCES.map((l) => createSellerChip({ label: l, onClick: (api) => api.setSelected(!api.selected) })));
  const setDemos = (on) => demos.forEach((c) => c.setSelected(on));
  const runWaves = (on) => waves.forEach((wave) => wave.forEach((c, i) => setTimeout(() => c.setSelected(on), i * 90)));
  const longLabels = ["Царапины по углам", "Следы носки на подкладке", "Потёртости на ручках и ремне", "Нет аксессуаров"];

  return section({
    id: "chip-variants",
    title: "Чипсы · варианты выбранного состояния",
    lead: "Эксперимент для сравнения, в заявку не внесён. У всех трёх одинаковые: пилюля 32 px, Manrope 13/18, отступы 12 / 8, зона нажатия 44 px, логика выбора. По умолчанию — светло-серый фон (grey-2) без видимой рамки. Выбранный — тёмно-зелёная обводка (green-7, 1 px + внутреннее кольцо 0,5 px), текст тёмный; рамка есть всегда (прозрачная), поэтому ничего не сдвигается. Фон, рамка и кольцо меняются за 200 мс по кривой флоу (.4, 0, .2, 1) и так же обратно; без масштаба и пружины; при «уменьшении движения» — мгновенно. Различается только фон выбранного: A — green-1, B — белый, C — тот же серый.",
    sources: [["Песочница", "sandbox/flow/seller-chip-variants.css (+ seller-chip.css, seller-chip.js)"], ["Референсы (Mobbin)", "Too Good To Go — фильтры (зелёная обводка + тон), Airbnb — типы впечатлений (тёмная обводка на белом), Tabby / Etsy — серые пилюли"]],
  },
    sub("Как в заявке: «Состояние лота», «Выбрать нюансы», «Комплектация»"),
    grid(...CHIP_VARIANTS.map(([v, label]) => state(label, flowVar(v, detailsGroups(() => {}).root)))),

    sub("По умолчанию и выбран"),
    row(() => chipRow(["Пыльник", "Коробка"], { selected: ["Коробка"] }), "«Пыльник» — по умолчанию, «Коробка» — выбран."),

    sub("Анимация выбора и снятия"),
    grid(...CHIP_VARIANTS.map(([v, label], i) => state(label, flowVar(v, h("div", { class: "seller-details-chips" }, demos[i]), h("div", { class: "seller-details-chips" }, waves[i]))))),
    controls(btn("Выбрать во всех", () => setDemos(true)), btn("Снять во всех", () => setDemos(false)), btn("Волна: выбрать", () => runWaves(true)), btn("Волна: снять", () => runWaves(false))),
    chipCaption("Для разглядывания включите «Анимации ×0,2» в панели сверху."),

    sub("Одиночный выбор («Состояние лота»)"),
    row(() => singleGroup(CONDITION, "Отличное")),

    sub("Множественный выбор, несколько выбранных («Выбрать нюансы»)"),
    row(() => chipRow(NUANCES, { selected: ["Ткань", "Фурнитура", "Царапины по углам"] })),

    sub("«Комплектация»: «Нет аксессуаров» снимает остальные"),
    row(() => includesGroup(["Пыльник", "Коробка", "Ремень"])),

    sub("Длинные подписи и перенос на несколько строк (колонка 280 px)"),
    row(() => h("div", { style: "max-width: 280px" }, chipRow([...longLabels, ...INCLUDES.slice(1)], { selected: ["Следы носки на подкладке", "Коробка", "Замок"] }))),
  );
}

// ── Page shell ────────────────────────────────────────────────────────────────────────────────────────────────────
function seg(name, items, current, onPick) {
  const buttons = items.map(([value, label]) => btn(label, () => { buttons.forEach((b, i) => b.setAttribute("aria-pressed", String(items[i][0] === value))); onPick(value); }, { "aria-pressed": String(value === current) }));
  return h("div", { class: "ipg-toolbar__group" }, h("span", { class: "ipg-toolbar__name ds-text-caption" }, name), h("div", { class: "ipg-seg" }, buttons));
}
function setParam(key, value, fallback) {
  const url = new URL(location.href);
  if (value === fallback) url.searchParams.delete(key); else url.searchParams.set(key, value);
  history.replaceState(null, "", url);
}

function renderCompare() {
  const base = new URL(location.href);
  base.searchParams.delete("view");
  base.searchParams.set("embed", "1");
  const frame = (mode) => { const u = new URL(base); u.searchParams.set("source", mode); return h("iframe", { src: u.href, title: mode }); };
  const back = new URL(location.href);
  back.searchParams.delete("view");
  app.append(
    h("div", { class: "ipg-toolbar" }, h("div", { class: "ipg-wrap ipg-toolbar__inner" }, h("span", { class: "ds-text-body-s" }, "Сравнение: песочница слева, оригинал справа"), h("a", { class: "ipg-btn", href: back.href, style: "display:inline-flex;align-items:center;text-decoration:none" }, "Закрыть сравнение"))),
    h("div", { class: "ipg-compare" },
      h("div", { class: "ipg-compare__pane" }, h("p", { class: "ipg-compare__title ds-text-caption" }, "Песочница (sandbox/)"), frame("sandbox")),
      h("div", { class: "ipg-compare__pane" }, h("p", { class: "ipg-compare__title ds-text-caption" }, "Оригинал (UI Kit + снимок Flow)"), frame("original"))),
  );
}

function render() {
  document.body.dataset.bg = params.get("bg") ?? "white";
  document.body.dataset.width = params.get("width") ?? "auto";
  if (params.get("embed") === "1") document.body.dataset.embed = "1";
  if (params.get("view") === "compare") { renderCompare(); return; }

  const sections = [nextInputSections({ h, section, sub, state, controls, btn, toggleBtn, force }), textFieldSection(), textareaSection(), selectSection(), searchSection(), sellerFieldSection(), amountSection(), checkSection(), chipsSection(), chipVariantsSection(), layoutSection(), summarySection()];
  const compare = new URL(location.href);
  compare.searchParams.set("view", "compare");

  app.append(
    h("header", { class: "ipg-wrap ipg-header" },
      h("h1", { class: "ipg-header__title ds-text-heading-l" }, "Input Components Playground"),
      h("p", { class: "ipg-header__lead ds-text-body-s" }, "Все поля ввода проекта и их состояния на одной странице — для редизайна и сравнения. Компоненты здесь — изолированные копии (sandbox/): правки не попадают ни в UI Kit, ни в прототипы. Все данные — моковые.")),
    h("div", { class: "ipg-toolbar" },
      h("div", { class: "ipg-wrap" },
        h("div", { class: "ipg-toolbar__inner" },
          seg("Стили", [["sandbox", "Песочница"], ["original", "Оригинал"]], source, (v) => { setParam("source", v, "sandbox"); setSource(v); }),
          seg("Фон", [["white", "Белый"], ["grey", "Серый 1"], ["grey2", "Серый 2"]], document.body.dataset.bg, (v) => { document.body.dataset.bg = v; setParam("bg", v, "white"); }),
          seg("Ширина", [["auto", "Авто"], ["375", "Колонка 375"]], document.body.dataset.width, (v) => { document.body.dataset.width = v; setParam("width", v, "auto"); }),
          seg("Анимации", [["1", "×1"], ["0.2", "×0,2"]], "1", (v) => { rate = Number(v); }),
          h("a", { class: "ipg-btn ipg-compare-link", href: compare.href, style: "display:inline-flex;align-items:center;text-decoration:none" }, "Сравнить рядом")),
        h("nav", { class: "ipg-nav ds-text-body-s", "aria-label": "Разделы" }, NAV.map((n) => h("a", { href: `#${n.id}` }, n.title))))),
    h("main", { class: "ipg-wrap" }, sections),
  );
}

render();
if (source === "original") setSource("original");
else if (document.readyState === "complete") rebuildForced();
else addEventListener("load", rebuildForced, { once: true });
