import { sheet, head, body, actions } from "../ui/sheet.js?v=aa3029620a48";
import { createField } from "../../design-system/components/field/field.js?v=aa3029620a48";

// Figma «Работа» 482:2594. Glass close button added on request (not in the Figma node).
export default {
  id: "wishlist-login",
  kind: "sheet",
  title: "Вход ради вишлиста",
  hint: "Figma 482:2594 · поле почты, Close",
  pattern: "form",
  render: ({ close }) => sheet(
    head({ align: "center", icon: "heart", badge: "+1", heading: "Войдите или зарегистрируйтесь", text: "чтобы сохранять любимые лоты в вишлист \nи делиться ими" }),
    body([createField({ label: "Почта", placeholder: "annawintour@vogue.com", type: "email", autocomplete: "email" })]),
    actions({ primary: { label: "Продолжить", onClick: close } }),
  ),
};
