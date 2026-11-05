import { sheet, head } from "../ui/sheet.js?v=79479e4513d2";

// Figma «Работа» 497:4310. Text only, no actions: closes via backdrop, swipe or Escape.
export default {
  id: "sell-how-estimate",
  kind: "sheet",
  title: "Как мы рассчитываем стоимость",
  hint: "Figma 497:4310 · только текст",
  category: "simple",
  render: () => sheet(
    head({ heading: "Как мы рассчитываем стоимость?", text: "Это примерная цена на основании статистики по лотам, размещенным на THE CULTT за последний год. Точную итоговую сумму выплаты мы согласуем вместе с вами после подачи заявки." }),
  ),
};
