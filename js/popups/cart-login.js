import { sheet, head, actions } from "../ui/sheet.js?v=e353b1c2a59d";

// Figma «Работа» 497:3952. Close button added by the approved dismissal policy (optional, non-destructive sheet); not in the Figma node.
export default {
  id: "cart-login",
  kind: "sheet",
  title: "Вход для корзины",
  hint: "Figma 497:3952 · вход, одна кнопка, Close",
  dismiss: { closeButton: true, swipe: true, backdrop: true, escape: true },
  render: ({ close }) => sheet(
    head({ align: "center", icon: "shopping-bag", badge: "+1", title: "Войдите или зарегистрируйтесь,", text: "чтобы добавлять товары в корзину \nи оформлять заказы" }),
    actions({ primary: { label: "Продолжить", onClick: close } }),
  ),
};
