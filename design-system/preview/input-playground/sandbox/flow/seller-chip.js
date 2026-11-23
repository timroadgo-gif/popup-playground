// SellerChip — vanilla port of Desktop/Проект/Flow/src/SellerChip.jsx (commit 5b93ff2, 2026-11-23), same markup and timing:
// <button.seller-chip[aria-pressed]> › <svg.seller-chip__outline><path/></svg> + <span.seller-chip__label>.
// The pill path is measured from the chip (ResizeObserver, before paint like React's layout effect) so the outline sits on
// the 1 px border; --chip-len = path length drives the clockwise draw (CSS in seller-chip.css).
const SVG = "http://www.w3.org/2000/svg";

export function pillPath(width, height, inset) {
  const r = height / 2 - inset;
  const left = inset + r;
  const right = width - inset - r;
  const top = inset;
  const bottom = height - inset;
  const mid = width / 2;
  return `M${mid} ${top}H${right}A${r} ${r} 0 0 1 ${right} ${bottom}H${left}A${r} ${r} 0 0 1 ${left} ${top}Z`;
}

export function createSellerChip({ label, selected = false, disabled = false, onClick } = {}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "seller-chip";
  const text = document.createElement("span");
  text.className = "seller-chip__label";
  text.textContent = label;
  button.append(text);
  button.disabled = disabled;

  let size = null;
  let svg = null;
  let path = null;
  const measure = () => {
    const width = button.offsetWidth;
    const height = button.offsetHeight;
    if (!width || !height || (size && size.width === width && size.height === height)) return;
    size = { width, height };
    if (!svg) {
      svg = document.createElementNS(SVG, "svg");
      svg.setAttribute("class", "seller-chip__outline");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      path = document.createElementNS(SVG, "path");
      svg.append(path);
      button.prepend(svg);
    }
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    path.setAttribute("d", pillPath(width, height, 0.5));
    path.style.setProperty("--chip-len", `${Math.ceil(path.getTotalLength()) + 1}`);
  };
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(measure).observe(button);

  const api = {
    el: button,
    get selected() { return button.classList.contains("is-selected"); },
    setSelected(value) {
      button.classList.toggle("is-selected", !!value);
      button.setAttribute("aria-pressed", String(!!value));
    },
    setDisabled(value) { button.disabled = !!value; },
  };
  api.setSelected(selected);
  button.addEventListener("click", () => onClick?.(api));
  return api;
}
