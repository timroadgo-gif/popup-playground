// Add, change or remove a popup: edit this list. Each variant lives in js/popups/<id>.js.
// Grouped by product flow so the list stays readable as it grows.
import infoSheet from "./popups/info-sheet.js?v=3bc56573435e";
import wishlistLogin from "./popups/wishlist-login.js?v=3bc56573435e";
import cartLogin from "./popups/cart-login.js?v=3bc56573435e";
import waitlistSubscribe from "./popups/waitlist-subscribe.js?v=3bc56573435e";
import sellHowEstimate from "./popups/sell-how-estimate.js?v=3bc56573435e";
import sellNoEstimate from "./popups/sell-no-estimate.js?v=3bc56573435e";
import sellInsider from "./popups/sell-insider.js?v=3bc56573435e";
import sellTelegram from "./popups/sell-telegram.js?v=3bc56573435e";
import sellThanks from "./popups/sell-thanks.js?v=3bc56573435e";

export const categories = [
  { id: "auth", title: "Вход", variants: [wishlistLogin, cartLogin] },
  { id: "sell", title: "Продажа", variants: [sellHowEstimate, sellNoEstimate, sellInsider, sellTelegram, sellThanks] },
  { id: "waitlist", title: "Лист ожидания", variants: [waitlistSubscribe] },
  { id: "base", title: "Шаблоны", variants: [infoSheet] },
];
