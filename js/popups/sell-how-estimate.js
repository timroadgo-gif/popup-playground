import { sheet, head } from "../ui/sheet.js?v=aa3029620a48";

// Figma «Работа» 497:4310. Text only; closes via Close, swipe, backdrop or Escape.
export default {
  id: "sell-how-estimate",
  kind: "sheet",
  title: "Как мы рассчитываем стоимость",
  hint: "Figma 497:4310 · только текст, Close",
  pattern: "info",
  render: () => sheet(
    head({ heading: "Как мы рассчитываем стоимость?", text: "Это примерная цена на основании статистики по лотам, размещенным на THE CULTT за последний год. Точную итоговую сумму выплаты мы согласуем вместе с вами после подачи заявки." }),
  ),
};
