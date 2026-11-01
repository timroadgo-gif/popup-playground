// Add, change or remove a popup: edit this list. Each variant lives in js/popups/<id>.js.
// Grouped by product flow so the list stays readable as it grows.
import infoSheet from "./popups/info-sheet.js?v=aa3029620a48";
import wishlistLogin from "./popups/wishlist-login.js?v=aa3029620a48";
import cartLogin from "./popups/cart-login.js?v=aa3029620a48";
import waitlistSubscribe from "./popups/waitlist-subscribe.js?v=aa3029620a48";
import sellHowEstimate from "./popups/sell-how-estimate.js?v=aa3029620a48";
import sellNoEstimate from "./popups/sell-no-estimate.js?v=aa3029620a48";
import sellInsider from "./popups/sell-insider.js?v=aa3029620a48";
import sellTelegram from "./popups/sell-telegram.js?v=aa3029620a48";
import sellThanks from "./popups/sell-thanks.js?v=aa3029620a48";

export const categories = [
  { id: "auth", title: "Вход", variants: [wishlistLogin, cartLogin] },
  { id: "sell", title: "Продажа", variants: [sellHowEstimate, sellNoEstimate, sellInsider, sellTelegram, sellThanks] },
  { id: "waitlist", title: "Лист ожидания", variants: [waitlistSubscribe] },
  { id: "base", title: "Шаблоны", variants: [infoSheet] },
];
