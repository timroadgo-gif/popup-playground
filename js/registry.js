// Add, change or remove a popup: edit this list. Each variant lives in js/popups/<id>.js.
// Grouped by product flow so the list stays readable as it grows.
import infoSheet from "./popups/info-sheet.js?v=a4df8b32311b";
import wishlistLogin from "./popups/wishlist-login.js?v=a4df8b32311b";
import cartLogin from "./popups/cart-login.js?v=a4df8b32311b";
import waitlistSubscribe from "./popups/waitlist-subscribe.js?v=a4df8b32311b";
import sellHowEstimate from "./popups/sell-how-estimate.js?v=a4df8b32311b";
import sellNoEstimate from "./popups/sell-no-estimate.js?v=a4df8b32311b";
import sellInsider from "./popups/sell-insider.js?v=a4df8b32311b";
import sellTelegram from "./popups/sell-telegram.js?v=a4df8b32311b";
import sellThanks from "./popups/sell-thanks.js?v=a4df8b32311b";

export const categories = [
  { id: "auth", title: "Вход", variants: [wishlistLogin, cartLogin] },
  { id: "sell", title: "Продажа", variants: [sellHowEstimate, sellNoEstimate, sellInsider, sellTelegram, sellThanks] },
  { id: "waitlist", title: "Лист ожидания", variants: [waitlistSubscribe] },
  { id: "base", title: "Шаблоны", variants: [infoSheet] },
];
