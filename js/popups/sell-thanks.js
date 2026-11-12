import { sheet, head, actions } from "../ui/sheet.js?v=fa1ea569a47c";

// Figma «Работа» 497:3973
export default {
  id: "sell-thanks",
  kind: "sheet",
  title: "Спасибо за информацию",
  hint: "Figma 497:3973 · текст, кнопка",
  category: "simple",
  render: ({ close }) => sheet(
    head({ heading: "Спасибо за информацию", text: "Мы свяжемся с вами по почте с адреса selling@thecultt.com. Если у вас есть вопросы по заявке, напишите нам на этот адрес — будем рады помочь." }),
    actions({ primary: { label: "Завершить подачу", onClick: close } }),
  ),
};
