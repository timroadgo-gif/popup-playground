// Popup categories → layout and default dismissal policy (approved 2026-11-02). Two categories only:
//   simple — information, explanations, confirmations, prompts with at most one simple field. No close button and
//            no close-button row; equal top and bottom padding (css/sheet.css). Dismissed by its own actions,
//            backdrop tap, swipe or Escape; a keyboard-only close button appears only when it has keyboard focus.
//   form   — substantial data entry (two or more inputs). Top-right glass close button in its own row, heading
//            below it, 56 at the bottom.
// `guard`: once the user has changed a field, X / swipe / backdrop / Escape ask before discarding it (alert below);
// the popup's own buttons (Continue, "without e-mail", links) close directly — they are deliberate choices.
// A popup with no fields is never guarded in practice (nothing can change). A popup may pass its own `dismiss`
// to override a row, with a comment explaining why.
export const CATEGORIES = {
  simple: { closeButton: false, swipe: true, backdrop: true, escape: true, guard: true },
  form: { closeButton: true, swipe: true, backdrop: true, escape: true, guard: true },
};

// Discard confirmation (design-system Alert). Copy is a draft pending approval.
export const DISCARD_ALERT = {
  heading: "Закрыть без сохранения?",
  message: "Введённые данные не сохранятся.",
  confirm: "Закрыть",
  cancel: "Отмена",
};

export function dismissPolicy(variant) {
  const base = CATEGORIES[variant.category];
  if (!base) throw new Error(`Popup "${variant.id}": category "${variant.category}" is not one of ${Object.keys(CATEGORIES).join(" | ")}`);
  return { ...base, ...variant.dismiss };
}
