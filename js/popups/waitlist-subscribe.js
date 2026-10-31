import { sheet, head, body, actions } from "../ui/sheet.js?v=51a100bad073";
import { createField } from "../../design-system/components/field/field.js?v=51a100bad073";
import { createAccountNotice } from "../../design-system/components/account-notice/account-notice.js?v=51a100bad073";

// Figma «Работа» 497:4011. Dropdown option lists are not defined in the source, so the selects open nothing.
export default {
  id: "waitlist-subscribe",
  kind: "sheet",
  title: "Подписаться на модель",
  hint: "Figma 497:4011 · форма, 5 полей, Close",
  dismiss: { closeButton: true, swipe: true, backdrop: true, escape: true },
  render: ({ close }) => sheet(
    head({ heading: "Подписаться на модель", text: "Заполните заявку, чтобы узнать о появлении в наличии нужного вам аксессуара." }),
    body([
      createAccountNotice({ icon: "user", message: "Вам нужен аккаунт, чтобы создать заявку", parts: [{ link: "Войдите", onClick: close }, " или ", { link: "Зарегистрируйтесь", onClick: close }] }),
      createField({ label: "Почта", placeholder: "Ваша почта", type: "email", autocomplete: "email" }),
      createField({ label: "Номер телефона", placeholder: "Номер телефона", type: "tel", autocomplete: "tel" }),
      createField({ kind: "select", label: "Категория", placeholder: "Категория" }),
      createField({ kind: "select", label: "Бренд", placeholder: "Бренд" }),
      createField({ kind: "select", label: "Модель", placeholder: "Модель" }),
    ]),
    actions({ primary: { label: "Отправить заявку", onClick: close } }),
  ),
};
