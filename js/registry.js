// Add, change or remove a popup: edit this list. Each variant lives in js/popups/<id>.js.
// Grouped by product flow so the list stays readable as it grows.
import infoSheet from "./popups/info-sheet.js?v=db5962ca429c";
import wishlistLogin from "./popups/wishlist-login.js?v=db5962ca429c";
import cartLogin from "./popups/cart-login.js?v=db5962ca429c";
import waitlistSubscribe from "./popups/waitlist-subscribe.js?v=db5962ca429c";
import sellHowEstimate from "./popups/sell-how-estimate.js?v=db5962ca429c";
import sellNoEstimate from "./popups/sell-no-estimate.js?v=db5962ca429c";
import sellInsider from "./popups/sell-insider.js?v=db5962ca429c";
import sellTelegram from "./popups/sell-telegram.js?v=db5962ca429c";
import sellThanks from "./popups/sell-thanks.js?v=db5962ca429c";

export const categories = [
  { id: "auth", title: "Вход", variants: [wishlistLogin, cartLogin] },
  { id: "sell", title: "Продажа", variants: [sellHowEstimate, sellNoEstimate, sellInsider, sellTelegram, sellThanks] },
  { id: "waitlist", title: "Лист ожидания", variants: [waitlistSubscribe] },
  { id: "base", title: "Шаблоны", variants: [infoSheet] },
];
