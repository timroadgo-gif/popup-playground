import { sheet, head, body, actions } from "../ui/sheet.js?v=fa1ea569a47c";
import { createField } from "../../design-system/components/field/field.js?v=fa1ea569a47c";

// Figma «Работа» 482:2594. Simple despite the email field: one field, same sign-in gate as cart-login → drag indicator, no close
// button (as in the Figma node). The field makes it a full sheet; entered email is protected by the discard guard.
export default {
  id: "wishlist-login",
  kind: "sheet",
  title: "Вход ради вишлиста",
  hint: "Figma 482:2594 · поле почты",
  category: "simple",
  render: ({ close }) => sheet(
    head({ align: "center", icon: "heart", badge: "+1", heading: "Войдите или зарегистрируйтесь", text: "чтобы сохранять любимые лоты в вишлист \nи делиться ими" }),
    body([createField({ label: "Почта", placeholder: "annawintour@vogue.com", type: "email", autocomplete: "email" })]),
    actions({ primary: { label: "Продолжить", onClick: close } }),
  ),
};
