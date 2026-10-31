// Add, change or remove a popup: edit this list. Each variant lives in js/popups/<id>.js.
// Grouped by product flow so the list stays readable as it grows.
import infoSheet from "./popups/info-sheet.js?v=e353b1c2a59d";
import wishlistLogin from "./popups/wishlist-login.js?v=e353b1c2a59d";
import cartLogin from "./popups/cart-login.js?v=e353b1c2a59d";
import waitlistSubscribe from "./popups/waitlist-subscribe.js?v=e353b1c2a59d";
import sellHowEstimate from "./popups/sell-how-estimate.js?v=e353b1c2a59d";
import sellNoEstimate from "./popups/sell-no-estimate.js?v=e353b1c2a59d";
import sellInsider from "./popups/sell-insider.js?v=e353b1c2a59d";
import sellTelegram from "./popups/sell-telegram.js?v=e353b1c2a59d";
import sellThanks from "./popups/sell-thanks.js?v=e353b1c2a59d";

export const categories = [
  { id: "auth", title: "Вход", variants: [wishlistLogin, cartLogin] },
  { id: "sell", title: "Продажа", variants: [sellHowEstimate, sellNoEstimate, sellInsider, sellTelegram, sellThanks] },
  { id: "waitlist", title: "Лист ожидания", variants: [waitlistSubscribe] },
  { id: "base", title: "Шаблоны", variants: [infoSheet] },
];
