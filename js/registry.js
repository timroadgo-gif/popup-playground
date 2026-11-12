// Add, change or remove a popup: edit this list. Each variant lives in js/popups/<id>.js.
// Grouped by product flow so the list stays readable as it grows.
import infoSheet from "./popups/info-sheet.js?v=dcb6f1df0bab";
import wishlistLogin from "./popups/wishlist-login.js?v=dcb6f1df0bab";
import cartLogin from "./popups/cart-login.js?v=dcb6f1df0bab";
import waitlistSubscribe from "./popups/waitlist-subscribe.js?v=dcb6f1df0bab";
import sellHowEstimate from "./popups/sell-how-estimate.js?v=dcb6f1df0bab";
import sellNoEstimate from "./popups/sell-no-estimate.js?v=dcb6f1df0bab";
import sellInsider from "./popups/sell-insider.js?v=dcb6f1df0bab";
import sellTelegram from "./popups/sell-telegram.js?v=dcb6f1df0bab";
import sellThanks from "./popups/sell-thanks.js?v=dcb6f1df0bab";

export const categories = [
  { id: "auth", title: "Вход", variants: [wishlistLogin, cartLogin] },
  { id: "sell", title: "Продажа", variants: [sellHowEstimate, sellNoEstimate, sellInsider, sellTelegram, sellThanks] },
  { id: "waitlist", title: "Лист ожидания", variants: [waitlistSubscribe] },
  { id: "base", title: "Шаблоны", variants: [infoSheet] },
];
