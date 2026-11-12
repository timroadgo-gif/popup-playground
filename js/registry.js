// Add, change or remove a popup: edit this list. Each variant lives in js/popups/<id>.js.
// Grouped by product flow so the list stays readable as it grows.
import infoSheet from "./popups/info-sheet.js?v=bb723a630334";
import wishlistLogin from "./popups/wishlist-login.js?v=bb723a630334";
import cartLogin from "./popups/cart-login.js?v=bb723a630334";
import waitlistSubscribe from "./popups/waitlist-subscribe.js?v=bb723a630334";
import sellHowEstimate from "./popups/sell-how-estimate.js?v=bb723a630334";
import sellNoEstimate from "./popups/sell-no-estimate.js?v=bb723a630334";
import sellInsider from "./popups/sell-insider.js?v=bb723a630334";
import sellTelegram from "./popups/sell-telegram.js?v=bb723a630334";
import sellThanks from "./popups/sell-thanks.js?v=bb723a630334";

export const categories = [
  { id: "auth", title: "Вход", variants: [wishlistLogin, cartLogin] },
  { id: "sell", title: "Продажа", variants: [sellHowEstimate, sellNoEstimate, sellInsider, sellTelegram, sellThanks] },
  { id: "waitlist", title: "Лист ожидания", variants: [waitlistSubscribe] },
  { id: "base", title: "Шаблоны", variants: [infoSheet] },
];
