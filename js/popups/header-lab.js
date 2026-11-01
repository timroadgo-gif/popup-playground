import { sheet, head } from "../ui/sheet.js?v=514a9345035d";

// Header lab: Variant A (X leading) vs Variant B (X trailing) with identical copy — heading + description + X only.
// Headings and description are existing app copy (sell-telegram, sell-how-estimate, sell-no-estimate).
const text = "Это примерная цена на основании статистики по лотам, размещенным на THE CULTT за последний год. Точную итоговую сумму выплаты мы согласуем вместе с вами после подачи заявки.";
const headings = [
  ["short", "Короткий", "Будем на связи"],
  ["medium", "Средний", "Как мы рассчитываем стоимость?"],
  ["long", "Длинный", "К сожалению, мы не смогли рассчитать стоимость лота"],
];
const layouts = [
  ["close-leading", "A", "X слева"],
  ["close-trailing", "B", "X справа"],
];

export const headerLab = layouts.flatMap(([layout, key, side]) => headings.map(([id, size, heading]) => ({
  id: `lab-${key.toLowerCase()}-${id}`,
  kind: "sheet",
  title: `${key} · ${side} · ${size.toLowerCase()} заголовок`,
  hint: `Вариант ${key} · заголовок, описание, Close`,
  dismiss: { closeButton: true, swipe: true, backdrop: true, escape: true },
  render: () => sheet(head({ heading, text, layout })),
})));
