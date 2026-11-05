// Add, change or remove a popup: edit this list. Each variant lives in js/popups/<id>.js.
// Grouped by product flow so the list stays readable as it grows.
import infoSheet from "./popups/info-sheet.js?v=18b7047c1ffa";
import wishlistLogin from "./popups/wishlist-login.js?v=18b7047c1ffa";
import cartLogin from "./popups/cart-login.js?v=18b7047c1ffa";
import waitlistSubscribe from "./popups/waitlist-subscribe.js?v=18b7047c1ffa";
import sellHowEstimate from "./popups/sell-how-estimate.js?v=18b7047c1ffa";
import sellNoEstimate from "./popups/sell-no-estimate.js?v=18b7047c1ffa";
import sellInsider from "./popups/sell-insider.js?v=18b7047c1ffa";
import sellTelegram from "./popups/sell-telegram.js?v=18b7047c1ffa";
import sellThanks from "./popups/sell-thanks.js?v=18b7047c1ffa";

export const categories = [
  { id: "auth", title: "Вход", variants: [wishlistLogin, cartLogin] },
  { id: "sell", title: "Продажа", variants: [sellHowEstimate, sellNoEstimate, sellInsider, sellTelegram, sellThanks] },
  { id: "waitlist", title: "Лист ожидания", variants: [waitlistSubscribe] },
  { id: "base", title: "Шаблоны", variants: [infoSheet] },
];
