import { categories } from "./registry.js?v=3f44dd6d4607";
import { createHost } from "./popup-host.js?v=3f44dd6d4607";

const device = document.getElementById("device");
const app = document.getElementById("app");
let scale = 1;

function fit() {
  const phone = matchMedia("(max-width: 440px)").matches;
  scale = phone ? 1 : Math.min(1, (innerHeight - 48) / 874);
  device.style.setProperty("--scale", scale);
}
addEventListener("resize", fit);
fit();

const host = createHost({
  layer: document.getElementById("popup-layer"),
  background: [app],
  getScale: () => scale,
});

const chevron = '<svg viewBox="0 0 8 14" aria-hidden="true"><path d="M1 1l6 6-6 6"/></svg>';
let n = 0;

app.innerHTML = `
  <div class="eyebrow ds-text-overline">Playground · iOS 26</div>
  <h1 class="home__title ds-text-display">Система<br>попапов</h1>
  <p class="home__lead ds-text-body-s">Откройте паттерн, чтобы проверить открытие, закрытие и поведение при повторном вызове.</p>`;

for (const cat of categories) {
  const sec = document.createElement("section");
  sec.className = "cat";
  sec.innerHTML = `<div class="cat__head eyebrow ds-text-overline"><span>${cat.title}</span><span>${String(cat.variants.length).padStart(2, "0")}</span></div>`;
  const ul = document.createElement("ul");
  ul.className = "list";
  for (const v of cat.variants) {
    const li = document.createElement("li");
    li.innerHTML = `<button class="row" type="button" data-variant="${v.id}">
      <span class="row__n ds-text-caption">${String(++n).padStart(2, "0")}</span>
      <span class="row__t"><span class="row__title ds-text-body">${v.title}</span><span class="row__hint ds-text-caption">${v.hint}</span></span>${chevron}</button>`;
    li.firstElementChild.addEventListener("click", (e) => host.open(v, e.currentTarget));
    ul.append(li);
  }
  sec.append(ul);
  app.append(sec);
}
