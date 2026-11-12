// Add, change or remove a popup: edit this list. Each variant lives in js/popups/<id>.js.
// Grouped by product flow so the list stays readable as it grows.
import infoSheet from "./popups/info-sheet.js?v=d1d1bed862c9";
import wishlistLogin from "./popups/wishlist-login.js?v=d1d1bed862c9";
import cartLogin from "./popups/cart-login.js?v=d1d1bed862c9";
import waitlistSubscribe from "./popups/waitlist-subscribe.js?v=d1d1bed862c9";
import sellHowEstimate from "./popups/sell-how-estimate.js?v=d1d1bed862c9";
import sellNoEstimate from "./popups/sell-no-estimate.js?v=d1d1bed862c9";
import sellInsider from "./popups/sell-insider.js?v=d1d1bed862c9";
import sellTelegram from "./popups/sell-telegram.js?v=d1d1bed862c9";
import sellThanks from "./popups/sell-thanks.js?v=d1d1bed862c9";

export const categories = [
  { id: "auth", title: "Вход", variants: [wishlistLogin, cartLogin] },
  { id: "sell", title: "Продажа", variants: [sellHowEstimate, sellNoEstimate, sellInsider, sellTelegram, sellThanks] },
  { id: "waitlist", title: "Лист ожидания", variants: [waitlistSubscribe] },
  { id: "base", title: "Шаблоны", variants: [infoSheet] },
];
