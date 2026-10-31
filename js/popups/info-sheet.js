import { sheet, head, body, node } from "../ui/sheet.js?v=c2abed233231";

// Content-heavy informational sheet (template). Read-only, closing loses nothing → Close + swipe, single detent,
// dismissible via backdrop. Copy is placeholder.
const steps = ["Осмотр куратором", "Независимая экспертиза", "Публикация в каталоге"];

export default {
  id: "info-sheet",
  kind: "sheet",
  title: "Информационная шторка",
  hint: "Только чтение · Close + свайп вниз",
  dismiss: { closeButton: true, swipe: true, backdrop: true, escape: true },
  render: () => sheet(
    head({ kicker: "Экспертиза", title: "Как мы проверяем каждую сумку", text: "Перед публикацией модель проходит несколько этапов проверки. Подлинность подтверждает только независимая экспертиза." }),
    body([node("ol", "ps__list ds-text-body", steps.map((t, i) => node("li", null, [Object.assign(node("span", "ds-text-caption"), { textContent: String(i + 1).padStart(2, "0") }), t])))]),
  ),
};
