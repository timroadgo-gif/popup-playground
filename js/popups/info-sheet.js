// Informational sheet. Research basis: read-only, closing loses nothing → Close (not Cancel),
// swipe down on, single detent → no grabber, dismissible via backdrop. Copy is placeholder.
export default {
  id: "info-sheet",
  kind: "sheet",
  title: "Информационная шторка",
  hint: "Только чтение · Close + свайп вниз",
  dismiss: { closeButton: true, swipe: true, backdrop: true, escape: true },

  render() {
    const root = document.createElement("section");
    root.className = "info";
    root.innerHTML = `
      <div class="eyebrow ds-text-overline">Экспертиза</div>
      <h2 class="info__title ds-text-heading-l">Как мы проверяем каждую сумку</h2>
      <p class="info__body ds-text-body">Перед публикацией модель проходит несколько этапов проверки. Подлинность подтверждает только независимая экспертиза.</p>
      <ol class="info__steps ds-text-body">
        <li><span class="ds-text-caption">01</span>Осмотр куратором</li>
        <li><span class="ds-text-caption">02</span>Независимая экспертиза</li>
        <li><span class="ds-text-caption">03</span>Публикация в каталоге</li>
      </ol>`;
    return root;
  },
};
