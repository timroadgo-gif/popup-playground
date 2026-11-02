import { sheet, head, actions } from "../ui/sheet.js?v=06e89fac3a7d";

// Figma «Работа» 497:3952. Simple: message + one action, no close button (as in the Figma node).
export default {
  id: "cart-login",
  kind: "sheet",
  title: "Вход для корзины",
  hint: "Figma 497:3952 · вход, одна кнопка",
  category: "simple",
  render: ({ close }) => sheet(
    head({ align: "center", icon: "shopping-bag", badge: "+1", heading: "Войдите или зарегистрируйтесь", text: "чтобы добавлять товары в корзину \nи оформлять заказы" }),
    actions({ primary: { label: "Продолжить", onClick: close } }),
  ),
};
