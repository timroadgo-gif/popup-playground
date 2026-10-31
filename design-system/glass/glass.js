// GlassSurface runtime. applyGlass(el, { shape }) puts the canonical material (css/glass.css) on an element and,
// in Chromium only, adds edge refraction: an SVG displacement map used through backdrop-filter: url().
// Safari and Firefox do not render url() in backdrop-filter (and @supports reports it as supported), so the
// browser is detected here and they keep the identical material without lensing.

export const SHAPES = ["circle", "pill", "rounded"];
export const MATERIALS = ["light"]; // other materials need design approval

const NS = "http://www.w3.org/2000/svg";
const CHROMIUM = !!navigator.userAgentData?.brands?.some((b) => /Chromium/.test(b.brand));
const NO_LENS = matchMedia("(prefers-reduced-transparency: reduce)");
let defs = null;
let seq = 0;

export const supportsRefraction = () => CHROMIUM && !NO_LENS.matches && !location.search.includes("glass=flat");

export function applyGlass(el, { shape = "circle", material = "light", refraction = true } = {}) {
  if (!SHAPES.includes(shape)) throw new Error(`GlassSurface: shape "${shape}" is not one of ${SHAPES.join(" | ")}`);
  if (!MATERIALS.includes(material)) throw new Error(`GlassSurface: material "${material}" is not approved`);
  el.classList.add("ds-glass");
  if (shape === "rounded") el.classList.add("ds-corner");
  Object.assign(el.dataset, { shape, material });
  if (refraction && supportsRefraction()) lens(el);
  return el;
}

export function createGlassSurface({ tag = "div", shape, material, refraction } = {}) {
  return applyGlass(document.createElement(tag), { shape, material, refraction });
}

// ---- refraction (Chromium) ----

const tokenPx = (el, name) => parseFloat(getComputedStyle(el).getPropertyValue(name)) || 0;

function lens(el) {
  const id = `ds-glass-lens-${++seq}`;
  if (el.isConnected) build(el, id); // already laid out: lens now; detached elements wait for the observer
  new ResizeObserver(() => build(el, id)).observe(el);
}

function build(el, id) {
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  if (!w || !h) return;
  const style = getComputedStyle(el);
  const shape = el.dataset.shape;
  const r = shape === "rounded" ? tokenPx(el, "--corner-radius") : Math.min(w, h) / 2;
  const depth = tokenPx(el, "--glass-light-refraction-depth");
  const scale = tokenPx(el, "--glass-light-refraction-scale");
  if (!depth || !scale) return;

  defs ??= (() => {
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    document.body.append(svg);
    return svg;
  })();
  let filter = defs.querySelector(`#${id}`);
  if (!filter) {
    filter = document.createElementNS(NS, "filter");
    filter.id = id;
    // Frost and saturation run inside the same filter: Chromium mis-samples the backdrop when url() is chained
    // with other backdrop-filter functions (verified: the glass turned flat grey).
    filter.innerHTML =
      '<feImage result="map" preserveAspectRatio="none"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="G" result="lens"/>' +
      '<feGaussianBlur in="lens" result="frost"/>' +
      '<feColorMatrix in="frost" type="saturate"/>';
    defs.append(filter);
  }
  const attrs = { x: 0, y: 0, width: w, height: h, filterUnits: "userSpaceOnUse", "color-interpolation-filters": "sRGB" };
  for (const [k, v] of Object.entries(attrs)) filter.setAttribute(k, v);
  const img = filter.querySelector("feImage");
  for (const [k, v] of Object.entries({ x: 0, y: 0, width: w, height: h })) img.setAttribute(k, v);
  img.setAttribute("href", displacementMap(w, h, r, depth));
  // feDisplacementMap offset = scale × (channel − 0.5); a channel of 128 ± 127 gives ± scale / 2.
  filter.querySelector("feDisplacementMap").setAttribute("scale", scale * 2);

  filter.querySelector("feGaussianBlur").setAttribute("stdDeviation", parseFloat(style.getPropertyValue("--glass-light-frost")) || 0);
  filter.querySelector("feColorMatrix").setAttribute("values", style.getPropertyValue("--glass-light-saturation").trim() || 1);
  el.style.backdropFilter = `url(#${id})`;
  el.dataset.refraction = "on";
}

// Convex bezel: inside a band of `depth` px from the edge the backdrop is sampled further inward, strongest at the
// edge (t²), which magnifies the content at the rim like the edge of a lens. Neutral (128,128) elsewhere.
function displacementMap(w, h, r, depth) {
  const k = 2; // map resolution per CSS px
  const W = Math.round(w * k);
  const H = Math.round(h * k);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const data = ctx.createImageData(W, H);
  const hx = w / 2;
  const hy = h / 2;
  r = Math.min(r, hx, hy);
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const px = (i + 0.5) / k - hx;
      const py = (j + 0.5) / k - hy;
      const qx = Math.abs(px) - (hx - r);
      const qy = Math.abs(py) - (hy - r);
      let nx, ny, dist;
      if (qx > 0 && qy > 0) {
        const len = Math.hypot(qx, qy) || 1;
        dist = len - r;
        nx = (qx / len) * Math.sign(px);
        ny = (qy / len) * Math.sign(py);
      } else if (qx > qy) {
        dist = qx - r;
        nx = Math.sign(px);
        ny = 0;
      } else {
        dist = qy - r;
        nx = 0;
        ny = Math.sign(py);
      }
      const inside = -dist;
      let dx = 0;
      let dy = 0;
      if (inside > 0 && inside < depth) {
        const t = 1 - inside / depth;
        const m = t * t;
        dx = -nx * m; // sample toward the centre
        dy = -ny * m;
      }
      const o = (j * W + i) * 4;
      data.data[o] = 128 + Math.round(127 * dx);
      data.data[o + 1] = 128 + Math.round(127 * dy);
      data.data[o + 2] = 128;
      data.data[o + 3] = 255;
    }
  }
  ctx.putImageData(data, 0, 0);
  return canvas.toDataURL();
}
