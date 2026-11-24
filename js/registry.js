// Add, change or remove a popup: edit this list. Each variant lives in js/popups/<id>.js.
// Grouped by product flow so the list stays readable as it grows.
import infoSheet from "./popups/info-sheet.js?v=cbc81ceff63d";
import wishlistLogin from "./popups/wishlist-login.js?v=cbc81ceff63d";
import cartLogin from "./popups/cart-login.js?v=cbc81ceff63d";
import waitlistSubscribe from "./popups/waitlist-subscribe.js?v=cbc81ceff63d";
import sellHowEstimate from "./popups/sell-how-estimate.js?v=cbc81ceff63d";
import sellNoEstimate from "./popups/sell-no-estimate.js?v=cbc81ceff63d";
import sellInsider from "./popups/sell-insider.js?v=cbc81ceff63d";
import sellTelegram from "./popups/sell-telegram.js?v=cbc81ceff63d";
import sellThanks from "./popups/sell-thanks.js?v=cbc81ceff63d";

export const categories = [
  { id: "auth", title: "Вход", variants: [wishlistLogin, cartLogin] },
  { id: "sell", title: "Продажа", variants: [sellHowEstimate, sellNoEstimate, sellInsider, sellTelegram, sellThanks] },
  { id: "waitlist", title: "Лист ожидания", variants: [waitlistSubscribe] },
  { id: "base", title: "Шаблоны", variants: [infoSheet] },
];
