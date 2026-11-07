// Add, change or remove a popup: edit this list. Each variant lives in js/popups/<id>.js.
// Grouped by product flow so the list stays readable as it grows.
import infoSheet from "./popups/info-sheet.js?v=df7fff2baa0a";
import wishlistLogin from "./popups/wishlist-login.js?v=df7fff2baa0a";
import cartLogin from "./popups/cart-login.js?v=df7fff2baa0a";
import waitlistSubscribe from "./popups/waitlist-subscribe.js?v=df7fff2baa0a";
import sellHowEstimate from "./popups/sell-how-estimate.js?v=df7fff2baa0a";
import sellNoEstimate from "./popups/sell-no-estimate.js?v=df7fff2baa0a";
import sellInsider from "./popups/sell-insider.js?v=df7fff2baa0a";
import sellTelegram from "./popups/sell-telegram.js?v=df7fff2baa0a";
import sellThanks from "./popups/sell-thanks.js?v=df7fff2baa0a";

export const categories = [
  { id: "auth", title: "Вход", variants: [wishlistLogin, cartLogin] },
  { id: "sell", title: "Продажа", variants: [sellHowEstimate, sellNoEstimate, sellInsider, sellTelegram, sellThanks] },
  { id: "waitlist", title: "Лист ожидания", variants: [waitlistSubscribe] },
  { id: "base", title: "Шаблоны", variants: [infoSheet] },
];
