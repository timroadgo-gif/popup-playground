import { sheet, head, actions } from "../ui/sheet.js?v=0f74c2737810";

// Figma «Работа» 497:4298. The explanation is ordinary description text on the sheet (no callout panel),
// as in the Figma «Pop Up Текст» frames.
export default {
  id: "sell-no-estimate",
  kind: "sheet",
  title: "Не удалось рассчитать стоимость",
  hint: "Figma 497:4298 · текст, две кнопки, Close",
  dismiss: { closeButton: true, swipe: true, backdrop: true, escape: true },
  render: ({ close }) => sheet(
    head({ heading: "К сожалению, мы не смогли рассчитать стоимость лота",
      text: "Сейчас у нас недостаточно данных для расчета цены. Заполните заявку на продажу и менеджер поможет определить размер выплаты." }),
    actions({ primary: { label: "Заполнить заявку на продажу", onClick: close }, secondary: { label: "Написать нам в Telegram", onClick: close } }),
  ),
};
