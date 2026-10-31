// Add, change or remove a popup: edit this list. Each variant lives in js/popups/<id>.js.
// Grouped by product flow so the list stays readable as it grows.
import infoSheet from "./popups/info-sheet.js?v=c2abed233231";
import wishlistLogin from "./popups/wishlist-login.js?v=c2abed233231";
import cartLogin from "./popups/cart-login.js?v=c2abed233231";
import waitlistSubscribe from "./popups/waitlist-subscribe.js?v=c2abed233231";
import sellHowEstimate from "./popups/sell-how-estimate.js?v=c2abed233231";
import sellNoEstimate from "./popups/sell-no-estimate.js?v=c2abed233231";
import sellInsider from "./popups/sell-insider.js?v=c2abed233231";
import sellTelegram from "./popups/sell-telegram.js?v=c2abed233231";
import sellThanks from "./popups/sell-thanks.js?v=c2abed233231";

export const categories = [
  { id: "auth", title: "Вход", variants: [wishlistLogin, cartLogin] },
  { id: "sell", title: "Продажа", variants: [sellHowEstimate, sellNoEstimate, sellInsider, sellTelegram, sellThanks] },
  { id: "waitlist", title: "Лист ожидания", variants: [waitlistSubscribe] },
  { id: "base", title: "Шаблоны", variants: [infoSheet] },
];
