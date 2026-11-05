// Add, change or remove a popup: edit this list. Each variant lives in js/popups/<id>.js.
// Grouped by product flow so the list stays readable as it grows.
import infoSheet from "./popups/info-sheet.js?v=91ea25ebb40d";
import wishlistLogin from "./popups/wishlist-login.js?v=91ea25ebb40d";
import cartLogin from "./popups/cart-login.js?v=91ea25ebb40d";
import waitlistSubscribe from "./popups/waitlist-subscribe.js?v=91ea25ebb40d";
import sellHowEstimate from "./popups/sell-how-estimate.js?v=91ea25ebb40d";
import sellNoEstimate from "./popups/sell-no-estimate.js?v=91ea25ebb40d";
import sellInsider from "./popups/sell-insider.js?v=91ea25ebb40d";
import sellTelegram from "./popups/sell-telegram.js?v=91ea25ebb40d";
import sellThanks from "./popups/sell-thanks.js?v=91ea25ebb40d";

export const categories = [
  { id: "auth", title: "Вход", variants: [wishlistLogin, cartLogin] },
  { id: "sell", title: "Продажа", variants: [sellHowEstimate, sellNoEstimate, sellInsider, sellTelegram, sellThanks] },
  { id: "waitlist", title: "Лист ожидания", variants: [waitlistSubscribe] },
  { id: "base", title: "Шаблоны", variants: [infoSheet] },
];
