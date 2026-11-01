import { sheet, head, actions } from "../ui/sheet.js?v=39feac9d04b7";
import { createCallout } from "../../design-system/components/callout/callout.js?v=39feac9d04b7";

// Figma «Работа» 497:4298
export default {
  id: "sell-no-estimate",
  kind: "sheet",
  title: "Не удалось рассчитать стоимость",
  hint: "Figma 497:4298 · плашка, две кнопки, Close",
  dismiss: { closeButton: true, swipe: true, backdrop: true, escape: true },
  render: ({ close }) => sheet(
    head({ heading: "К сожалению, мы не смогли рассчитать стоимость лота",
      extra: createCallout({ text: "Сейчас у нас недостаточно данных для расчета цены. Заполните заявку на продажу и менеджер поможет определить размер выплаты." }) }),
    actions({ primary: { label: "Заполнить заявку на продажу", onClick: close }, secondary: { label: "Написать нам в Telegram", onClick: close } }),
  ),
};
