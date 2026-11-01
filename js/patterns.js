// Popup content patterns → default dismissal policy (context/research/popup-taxonomy-2026-11-01/report.md).
// One table instead of a hand-written `dismiss` per popup. Values mirror the behaviour approved so far; changing a
// row changes every popup of that pattern, so each change needs approval. A popup may still pass its own `dismiss`
// to override a row, with a comment explaining why.
//   info       — explanation the user asked for (no decision, no input)
//   prompt     — state + one or two paths, no input; closing loses nothing
//   completion — confirms something already done and says what happens next
//   form       — collects data (fields, consents, selects)
// `guard`: once the user has changed a field, X / swipe / backdrop / Escape ask before discarding it (alert below);
// the popup's own buttons (Continue, "without e-mail", links) close directly — they are deliberate choices.
const ALL = { closeButton: true, swipe: true, backdrop: true, escape: true, guard: false };

export const PATTERNS = {
  info: ALL,
  prompt: ALL,
  completion: ALL,
  form: { ...ALL, guard: true }, // stage 3, approved 2026-11-01
};

// Discard confirmation (design-system Alert). Copy is a draft pending approval.
export const DISCARD_ALERT = {
  heading: "Закрыть без сохранения?",
  message: "Введённые данные не сохранятся.",
  confirm: "Закрыть",
  cancel: "Отмена",
};

export function dismissPolicy(variant) {
  const base = PATTERNS[variant.pattern];
  if (!base) throw new Error(`Popup "${variant.id}": pattern "${variant.pattern}" is not one of ${Object.keys(PATTERNS).join(" | ")}`);
  return { ...base, ...variant.dismiss };
}
