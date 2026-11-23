// «Новое поле · Input (кандидат)» — sections of the Input Components Playground for the proposed field
// (sandbox/next/input.*). The page helpers (h, section, state, …) are passed in by playground.js. Mock data only.
import { createInput } from "./sandbox/next/input.js?v=5142bc3a314a";
import { createButton } from "../../components/button/button.js?v=5142bc3a314a";

const CATEGORIES = ["Сумки", "Обувь", "Аксессуары", "Украшения", "Одежда"];
const CITIES = ["Москва", "Санкт-Петербург", "Казань", "Екатеринбург", "Краснодар"];
const LONG_LABEL = "Адрес регистрации по месту жительства, как указано в паспорте";
const LONG_NAME = "Константинопольская-Ленинградская Александра Владиславовна";
const LONG_EMAIL = "konstantinopolskaya.leningradskaya.alexandra@example.com";

export function nextInputSections({ h, section, sub, state, controls, btn, toggleBtn, force }) {
  const input = (opts) => createInput(opts);
  const focused = (opts) => { const f = input(opts); force({ el: f.root }, "focus"); return f; };
  const row = (cols, ...fields) => h("div", { class: `ipg-row ipg-row--${cols}` }, ...fields);
  const stack = (...fields) => h("div", { class: "ipg-stack" }, ...fields);
  const card = (...children) => h("div", { class: "ipg-card ds-corner" }, ...children);
  const log = () => h("p", { class: "ipg-log ds-text-caption", "aria-live": "polite" });

  // ── 1. Floating label playground ───────────────────────────────────────────────────────────────────────────────
  function demo() {
    const f = input({ label: "Имя", helper: "Как в паспорте" });
    const out = log();
    const say = (t) => { out.textContent = t; };
    return h("div", { class: "ipg-demo" },
      h("div", { class: "ipg-stage ipg-stage--demo" }, f),
      controls(
        btn("Ввести «Наталья Спилберг»", () => { f.setValue("Наталья Спилберг"); say("Значение подставлено без фокуса: метка уже наверху."); }),
        btn("Очистить", () => { f.setValue(""); f.setError(null); say("Пусто: метка вернулась на место плейсхолдера."); }),
        btn("Фокус", () => f.focus()),
        toggleBtn("Ошибка", (on) => { f.setError(on ? "Имя — только буквы и дефис" : null); }),
        toggleBtn("Успех", (on) => f.setSuccess(on)),
        toggleBtn("Disabled", (on) => f.setDisabled(on)),
        toggleBtn("Read-only", (on) => f.setReadOnly(on)),
      ),
      out);
  }

  // ── 2. States ──────────────────────────────────────────────────────────────────────────────────────────────────
  function states() {
    const errEmpty = input({ label: "Почта", kind: "email", required: true });
    errEmpty.setError("Заполните поле");
    const errFilled = input({ label: "Почта", kind: "email", value: "natali.spilberg@mail" });
    errFilled.validate();
    const ok = input({ label: "Почта", kind: "email", value: "natali@spilberg.ru", successOnValid: true });
    ok.validate();
    return h("div", { class: "ipg-grid" },
      state("1 · Пусто", input({ label: "Имя" })),
      state("2 · Пусто + фокус", focused({ label: "Телефон", kind: "tel", hint: "+7 (000) 000-00-00" }), "Фокус зафиксирован: виден формат номера"),
      state("3 · Заполнено + фокус", focused({ label: "Имя", value: "Натали Спилберг" }), "Чёрная обводка 1px"),
      state("4 · Заполнено", input({ label: "Имя", value: "Натали Спилберг" })),
      state("5 · Ошибка · пусто", errEmpty, "После «Отправить» в незаполненном обязательном поле"),
      state("6 · Ошибка · заполнено", errFilled, "Проверка при уходе из поля"),
      state("7 · Disabled · пусто", input({ label: "Отчество", disabled: true })),
      state("8 · Disabled · заполнено", input({ label: "Город", value: "Москва", disabled: true })),
      state("9 · Read-only", input({ label: "Номер заявки", value: "CU-2026-004718", readOnly: true }), "Можно выделить и скопировать"),
      state("10 · Успех", ok, "Почта проверена после ухода из поля"),
    );
  }

  // ── 3. Kinds ───────────────────────────────────────────────────────────────────────────────────────────────────
  function kinds() {
    return h("div", { class: "ipg-grid" },
      state("Текст", input({ label: "Имя", autocomplete: "given-name" }), "Клавиатура с заглавной буквы"),
      state("Почта", input({ kind: "email", label: "Почта", hint: "name@mail.ru", successOnValid: true }), "Клавиатура с @, без автоисправления; проверка при уходе"),
      state("Телефон", input({ kind: "tel", label: "Телефон", hint: "+7 (000) 000-00-00", successOnValid: true }), "Цифровая клавиатура, маска +7, 8 в начале = +7"),
      state("Число", input({ kind: "number", label: "Желаемая цена", suffix: "₽", min: 1000, hint: "0" }), "Только цифры, разряды через пробел, минимум 1 000 ₽"),
      state("Пароль", input({ kind: "password", label: "Пароль", helper: "Не короче 8 символов", autocomplete: "new-password" }), "«Показать» не уводит фокус и курсор"),
      state("Многострочное", input({ kind: "textarea", label: "Комментарий к лоту", maxLength: 500, counter: true }), "Растёт по тексту, счётчик символов"),
      state("Выбор из списка", input({ kind: "select", label: "Категория", options: CATEGORIES }), "Системный список: колесо на iPhone, меню на компьютере"),
      state("Поиск", input({ kind: "search", label: "Бренд или модель" }), "Высота 56; подпись — только плейсхолдер, не всплывает"),
    );
  }

  // ── 4. A real form with validation ─────────────────────────────────────────────────────────────────────────────
  function form() {
    const out = log();
    const fields = {
      last: input({ label: "Фамилия", required: true, autocomplete: "family-name" }),
      first: input({ label: "Имя", required: true, autocomplete: "given-name" }),
      email: input({ kind: "email", label: "Почта", required: true, hint: "name@mail.ru", successOnValid: true }),
      tel: input({ kind: "tel", label: "Телефон", required: true, hint: "+7 (000) 000-00-00", successOnValid: true }),
      city: input({ kind: "select", label: "Город", options: CITIES, required: true }),
      comment: input({ kind: "textarea", label: "Комментарий", helper: "Необязательно", maxLength: 300, counter: true }),
    };
    const submit = createButton({ label: "Отправить заявку", width: "fill", type: "submit" });
    const el = h("form", { class: "ipg-form", novalidate: true, onsubmit: (e) => {
      e.preventDefault();
      const bad = Object.values(fields).filter((f) => !f.validate({ force: true }));
      if (bad.length) { bad[0].focus(); out.textContent = `Исправьте поля: ${bad.length}. Данные никуда не отправляются.`; }
      else out.textContent = "Всё заполнено верно. Это макет — данные никуда не отправляются.";
    } },
      row(2, fields.last, fields.first), fields.email, fields.tel, fields.city, fields.comment, submit, out);
    return card(el);
  }

  // ── 5. Layout and backgrounds ──────────────────────────────────────────────────────────────────────────────────
  const person = () => [input({ label: "Фамилия", value: "Спилберг" }), input({ label: "Имя", value: "Натали" }), input({ label: "Отчество" })];
  function layouts() {
    return [
      sub("Одна колонка"),
      h("div", { class: "ipg-grid ipg-grid--wide" },
        state("Контакты", stack(input({ label: "Имя", value: "Натали Спилберг" }), input({ kind: "tel", label: "Телефон", value: "9321233232" }), input({ kind: "email", label: "Почта" })))),
      sub("Два в ряд"),
      h("div", { class: "ipg-grid ipg-grid--wide" },
        state("Фамилия и имя", row(2, input({ label: "Фамилия", value: "Спилберг" }), input({ label: "Имя" }))),
        state("Цена и категория", row(2, input({ kind: "number", label: "Цена", suffix: "₽", value: "125000" }), input({ kind: "select", label: "Категория", options: CATEGORIES, value: "Сумки" })))),
      sub("Три в ряд"),
      h("div", { class: "ipg-grid ipg-grid--wide" },
        state("Строго три колонки", row(3, ...person()), "Стресс-тест: на 375 подписи обрезаются многоточием, поля остаются рабочими"),
        state("Три колонки, адаптивно", h("div", { class: "ipg-cq" }, row("3a", ...person())), "Уже 520 px контейнера — в одну колонку (container query)")),
      sub("Длинные подписи и значения"),
      h("div", { class: "ipg-grid ipg-grid--wide" },
        state("Длинная подпись", stack(input({ label: LONG_LABEL }), input({ label: LONG_LABEL, value: "Москва, Петровский бульвар, 10" }))),
        state("Длинные значения", stack(input({ label: "ФИО", value: LONG_NAME }), input({ kind: "email", label: "Почта", value: LONG_EMAIL }), input({ kind: "textarea", label: "Комментарий", value: "Сумка в отличном состоянии, есть пыльник и коробка. Небольшие потёртости на уголках, фурнитура без царапин. Чек из бутика сохранился." })))),
      sub("Фон: белый, светло-серый, белая карточка на сером"),
      h("div", { class: "ipg-grid ipg-grid--wide" },
        state("Белый", stack(...sampleFields()), null, "ipg-stage--white"),
        state("Светло-серый (grey-1)", stack(...sampleFields()), null, "ipg-stage--grey"),
        state("Белая карточка на сером", card(stack(...sampleFields())), null, "ipg-stage--grey")),
    ];
  }
  const sampleFields = () => [input({ label: "Имя", value: "Натали Спилберг" }), input({ kind: "tel", label: "Телефон" }), input({ kind: "select", label: "Город", options: CITIES })];

  return section({
    id: "input-next",
    title: "Новое поле · Input (кандидат)",
    lead: "Предлагаемое поле UI Kit по Figma «Работа» 696:5178: 72 px, плавающая метка, тонкая светло-серая обводка, непрерывные углы. Один компонент — восемь видов ввода. Живёт только здесь (sandbox/next/), UI Kit и приложение не меняются.",
    sources: [["Компонент", "sandbox/next/input.{css,js}, sandbox/next/spec.md"], ["Токены (предложение)", "sandbox/next/input-tokens.css"], ["Figma", "VHsF9oQk2DtcpGZXHkpSNp · 696:5178"]],
  },
    sub("Плавающая метка — попробуйте"),
    demo(),
    sub("Состояния"),
    states(),
    sub("Виды ввода"),
    kinds(),
    sub("Форма с проверкой"),
    h("div", { class: "ipg-grid ipg-grid--wide" }, h("div", { class: "ipg-state" }, h("p", { class: "ipg-state__label ds-text-caption" }, "Заявка на продажу — нажмите «Отправить» с пустыми полями"), h("div", { class: "ipg-stage ipg-stage--grey" }, form()))),
    ...layouts(),
  );
}
