// Add, change or remove a popup: edit this list. Each variant lives in js/popups/<id>.js.
// Grouped by product flow so the list stays readable as it grows.
import infoSheet from "./popups/info-sheet.js?v=fa1ea569a47c";
import wishlistLogin from "./popups/wishlist-login.js?v=fa1ea569a47c";
import cartLogin from "./popups/cart-login.js?v=fa1ea569a47c";
import waitlistSubscribe from "./popups/waitlist-subscribe.js?v=fa1ea569a47c";
import sellHowEstimate from "./popups/sell-how-estimate.js?v=fa1ea569a47c";
import sellNoEstimate from "./popups/sell-no-estimate.js?v=fa1ea569a47c";
import sellInsider from "./popups/sell-insider.js?v=fa1ea569a47c";
import sellTelegram from "./popups/sell-telegram.js?v=fa1ea569a47c";
import sellThanks from "./popups/sell-thanks.js?v=fa1ea569a47c";

export const categories = [
  { id: "auth", title: "Вход", variants: [wishlistLogin, cartLogin] },
  { id: "sell", title: "Продажа", variants: [sellHowEstimate, sellNoEstimate, sellInsider, sellTelegram, sellThanks] },
  { id: "waitlist", title: "Лист ожидания", variants: [waitlistSubscribe] },
  { id: "base", title: "Шаблоны", variants: [infoSheet] },
];
