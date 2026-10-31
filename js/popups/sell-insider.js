import { sheet, head, body, actions } from "../ui/sheet.js?v=950bf01060f3";
import { createField } from "../../design-system/components/field/field.js?v=950bf01060f3";
import { createCheckbox } from "../../design-system/components/checkbox/checkbox.js?v=950bf01060f3";

// Figma «Работа» 497:4279. No close control in the source; checkbox defaults as in the source
// (offer unchecked, newsletter checked). The source defines no validation, so none is added.
export default {
  id: "sell-insider",
  kind: "sheet",
  title: "Инсайдерская рассылка",
  hint: "Figma 497:4279 · почта, 2 согласия, без Close",
  dismiss: { swipe: true, backdrop: true, escape: true },
  render: ({ close }) => sheet(
    head({ title: "Еще немного инсайдерской информации?", size: "s", text: [
      "Мы рассчитали стоимость вашей сумки — вы узнаете ее на следующем шаге.",
      "Также мы можем прислать вам на почту список моделей сумок, которые сейчас наиболее востребованы среди покупателей THE CULTT — для этого нужно подписаться на рассылку.",
    ] }),
    body([
      createField({ label: "Почта", placeholder: "annawintour@vogue.com", type: "email", autocomplete: "email" }),
      body([
        createCheckbox({ label: "Я принимаю условия Публичной оферты и согласен (-а) на обработку своих персональных данных" }),
        createCheckbox({ label: "Согласен (-а) на получение рекламной рассылки и обработки своих персональных данных", checked: true }),
      ], { compact: true }),
    ]),
    actions({ primary: { label: "Продолжить", onClick: close }, secondary: { label: "Продолжить без E-mail", onClick: close } }),
  ),
};
