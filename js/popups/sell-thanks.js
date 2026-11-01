import { sheet, head, actions } from "../ui/sheet.js?v=556bc19251c3";

// Figma «Работа» 497:3973
export default {
  id: "sell-thanks",
  kind: "sheet",
  title: "Спасибо за информацию",
  hint: "Figma 497:3973 · текст, кнопка, Close",
  pattern: "completion", // pending Q3: completion only if the request is already sent before this sheet
  render: ({ close }) => sheet(
    head({ heading: "Спасибо за информацию", text: "Мы свяжемся с вами по почте с адреса selling@thecultt.com. Если у вас есть вопросы по заявке, напишите нам на этот адрес — будем рады помочь." }),
    actions({ primary: { label: "Завершить подачу", onClick: close } }),
  ),
};
