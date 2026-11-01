import { sheet, head, actions } from "../ui/sheet.js?v=8ee28e846d7c";

// Figma «Работа» 497:3952. Close button added by the approved dismissal policy (optional, non-destructive sheet); not in the Figma node.
export default {
  id: "cart-login",
  kind: "sheet",
  title: "Вход для корзины",
  hint: "Figma 497:3952 · вход, одна кнопка, Close",
  pattern: "prompt",
  render: ({ close }) => sheet(
    head({ align: "center", icon: "shopping-bag", badge: "+1", heading: "Войдите или зарегистрируйтесь", text: "чтобы добавлять товары в корзину \nи оформлять заказы" }),
    actions({ primary: { label: "Продолжить", onClick: close } }),
  ),
};
