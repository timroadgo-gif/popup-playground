// Add, change or remove a popup: edit this list. Each variant lives in js/popups/<id>.js.
// Grouped by product flow so the list stays readable as it grows.
import infoSheet from "./popups/info-sheet.js?v=514a9345035d";
import wishlistLogin from "./popups/wishlist-login.js?v=514a9345035d";
import cartLogin from "./popups/cart-login.js?v=514a9345035d";
import waitlistSubscribe from "./popups/waitlist-subscribe.js?v=514a9345035d";
import sellHowEstimate from "./popups/sell-how-estimate.js?v=514a9345035d";
import sellNoEstimate from "./popups/sell-no-estimate.js?v=514a9345035d";
import sellInsider from "./popups/sell-insider.js?v=514a9345035d";
import sellTelegram from "./popups/sell-telegram.js?v=514a9345035d";
import sellThanks from "./popups/sell-thanks.js?v=514a9345035d";
import { headerLab } from "./popups/header-lab.js?v=514a9345035d";

export const categories = [
  { id: "auth", title: "Вход", variants: [wishlistLogin, cartLogin] },
  { id: "sell", title: "Продажа", variants: [sellHowEstimate, sellNoEstimate, sellInsider, sellTelegram, sellThanks] },
  { id: "waitlist", title: "Лист ожидания", variants: [waitlistSubscribe] },
  { id: "base", title: "Шаблоны", variants: [infoSheet] },
  { id: "lab", title: "Шапка: A / B", variants: headerLab },
];
