// Add, change or remove a popup: edit this list. Each variant lives in js/popups/<id>.js.
// Grouped by product flow so the list stays readable as it grows.
import infoSheet from "./popups/info-sheet.js?v=f7c37eca60bb";
import wishlistLogin from "./popups/wishlist-login.js?v=f7c37eca60bb";
import cartLogin from "./popups/cart-login.js?v=f7c37eca60bb";
import waitlistSubscribe from "./popups/waitlist-subscribe.js?v=f7c37eca60bb";
import sellHowEstimate from "./popups/sell-how-estimate.js?v=f7c37eca60bb";
import sellNoEstimate from "./popups/sell-no-estimate.js?v=f7c37eca60bb";
import sellInsider from "./popups/sell-insider.js?v=f7c37eca60bb";
import sellTelegram from "./popups/sell-telegram.js?v=f7c37eca60bb";
import sellThanks from "./popups/sell-thanks.js?v=f7c37eca60bb";

export const categories = [
  { id: "auth", title: "Вход", variants: [wishlistLogin, cartLogin] },
  { id: "sell", title: "Продажа", variants: [sellHowEstimate, sellNoEstimate, sellInsider, sellTelegram, sellThanks] },
  { id: "waitlist", title: "Лист ожидания", variants: [waitlistSubscribe] },
  { id: "base", title: "Шаблоны", variants: [infoSheet] },
];
