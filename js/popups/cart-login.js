import { sheet, hero, actions } from "../ui/sheet.js?v=950bf01060f3";

// Figma «Работа» 497:3952. No close control in the source: dismiss by swipe, backdrop or Escape.
export default {
  id: "cart-login",
  kind: "sheet",
  title: "Вход для корзины",
  hint: "Figma 497:3952 · одна кнопка, без Close",
  dismiss: { swipe: true, backdrop: true, escape: true },
  render: ({ close }) => sheet(
    hero({ icon: "shopping-bag", badge: "+1", title: "Войдите или зарегистрируйтесь,", text: "чтобы добавлять товары в корзину \nи оформлять заказы" }),
    actions({ primary: { label: "Продолжить", onClick: close } }),
  ),
};
