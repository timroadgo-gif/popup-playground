// Popup host: one popup at a time. Variants supply content and dismissal policy; the host owns
// backdrop, motion, focus, inert background, swipe-to-dismiss and state reset (DOM is rebuilt per open).

import { createIconButton } from "../design-system/components/icon-button/icon-button.js?v=2ddd93318b9b";
import { createModalBackdrop, openBackdrop, closeBackdrop } from "../design-system/backdrop/backdrop.js?v=2ddd93318b9b";

const REDUCED = matchMedia("(prefers-reduced-motion: reduce)");
const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
const SWIPE_KINDS = new Set(["sheet"]);

const el = (cls) => Object.assign(document.createElement("div"), { className: cls });

// Close control = shared IconButton / Glass / Light, compact: secondary 32 glass circle, 44 × 44 hit area.
export function glassCloseButton(onClick) {
  return createIconButton({ icon: "close", ariaLabel: "Закрыть", size: "compact", onClick });
}

export function createHost({ layer, background, getScale = () => 1 }) {
  let cur = null;

  function open(variant, trigger) {
    if (cur) return;
    const dismiss = { backdrop: false, swipe: false, escape: false, closeButton: false, ...variant.dismiss };
    const root = el(`popup popup--${variant.kind}${variant.layout ? ` popup--${variant.layout}` : ""}`);
    const panel = el("popup__panel ds-corner");
    const scroll = el("popup__scroll");
    const ctx = { close: () => close() };
    // Shared ModalBackdrop; the artboard is an iPhone, so mobile values regardless of the desktop viewport.
    const backdrop = createModalBackdrop({ scope: "container", container: layer, platform: "mobile", onDismiss: dismiss.backdrop ? ctx.close : undefined });

    panel.setAttribute("role", variant.role || "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", variant.title);
    panel.tabIndex = -1;
    scroll.append(variant.render(ctx));
    panel.append(scroll);
    // Close button: in the header's own top-trailing control row above the heading ([data-close-slot]);
    // otherwise it floats top-trailing (icon-led prompts). No X → the slot is removed.
    const slot = scroll.querySelector("[data-close-slot]");
    if (dismiss.closeButton && slot) {
      slot.append(glassCloseButton(ctx.close));
    } else {
      slot?.remove();
      if (dismiss.closeButton) {
        const bar = el("popup__toolbar");
        bar.append(glassCloseButton(ctx.close));
        panel.append(bar);
      }
    }
    root.append(backdrop, panel);
    layer.append(root);
    background.forEach((n) => (n.inert = true));

    cur = { root, backdrop, panel, scroll, variant, trigger, closing: false };
    root.addEventListener("keydown", (e) => onKey(e, dismiss));
    if (dismiss.swipe && SWIPE_KINDS.has(variant.kind)) attachSwipe(cur);

    // Allow native scroll only when content overflows; otherwise the whole panel is a drag handle.
    if (scroll.scrollHeight > scroll.clientHeight) scroll.style.touchAction = "pan-y";

    openBackdrop(backdrop);
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add("is-open")));
    panel.focus({ preventScroll: true });
    variant.onOpen?.(ctx);
  }

  function close() {
    if (!cur || cur.closing) return;
    const c = cur;
    c.closing = true;
    c.panel.classList.remove("is-dragging");
    c.panel.style.transform = "";
    closeBackdrop(c.backdrop);
    c.root.classList.remove("is-open");
    c.root.classList.add("is-closing");

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      c.root.remove();
      background.forEach((n) => (n.inert = false));
      c.trigger?.focus({ preventScroll: true });
      cur = null;
      c.variant.onClose?.();
    };
    c.panel.addEventListener("transitionend", (e) => e.target === c.panel && finish());
    setTimeout(finish, REDUCED.matches ? 250 : 500);
  }

  function onKey(e, dismiss) {
    if (e.key === "Escape" && dismiss.escape) return close();
    if (e.key !== "Tab") return;
    const items = [...cur.panel.querySelectorAll(FOCUSABLE)];
    if (!items.length) return e.preventDefault();
    const first = items[0], last = items.at(-1);
    if (e.shiftKey && (document.activeElement === first || document.activeElement === cur.panel)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function attachSwipe(c) {
    const { panel, backdrop, scroll } = c;
    let startY = 0, dy = 0, lastY = 0, lastT = 0, v = 0, active = false;

    panel.addEventListener("pointerdown", (e) => {
      if (c.closing || e.button > 0 || e.target.closest("button,a,input,textarea,select")) return;
      if (scroll.scrollTop > 0) return;
      active = true;
      startY = lastY = e.clientY;
      lastT = e.timeStamp;
      dy = v = 0;
      panel.setPointerCapture(e.pointerId);
      panel.classList.add("is-dragging");
    });
    panel.addEventListener("pointermove", (e) => {
      if (!active) return;
      const raw = (e.clientY - startY) / getScale();
      dy = raw < 0 ? raw * 0.12 : raw; // slight resistance upward
      v = (e.clientY - lastY) / Math.max(1, e.timeStamp - lastT) / getScale();
      lastY = e.clientY;
      lastT = e.timeStamp;
      panel.style.transform = `translateY(${dy}px)`;
      backdrop.style.opacity = String(Math.max(0.2, 1 - Math.max(0, dy) / (panel.offsetHeight * 1.2)));
    });
    const end = () => {
      if (!active) return;
      active = false;
      if (dy > Math.min(120, panel.offsetHeight * 0.3) || v > 0.6) return close();
      panel.classList.remove("is-dragging");
      panel.style.transform = "";
      backdrop.style.opacity = "";
    };
    panel.addEventListener("pointerup", end);
    panel.addEventListener("pointercancel", end);
  }

  return { open, close };
}
