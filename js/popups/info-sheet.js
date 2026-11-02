import { sheet, head, body, node } from "../ui/sheet.js?v=a4df8b32311b";

// Content-heavy informational sheet (template). Read-only, closing loses nothing → simple: swipe, single detent,
// backdrop, Escape. Copy is placeholder.
const steps = ["Осмотр куратором", "Независимая экспертиза", "Публикация в каталоге"];

export default {
  id: "info-sheet",
  kind: "sheet",
  title: "Информационная шторка",
  hint: "Только чтение · свайп вниз",
  category: "simple",
  render: () => sheet(
    head({ heading: "Как мы проверяем каждую сумку", text: "Перед публикацией модель проходит несколько этапов проверки. Подлинность подтверждает только независимая экспертиза." }),
    body([node("ol", "ps__list ds-text-popup-body", steps.map((t, i) => node("li", null, [Object.assign(node("span", "ds-text-popup-meta"), { textContent: String(i + 1).padStart(2, "0") }), t])))]),
  ),
};
