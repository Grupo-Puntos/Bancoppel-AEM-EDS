/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-campaigns. Base: tabs.
 * Source: https://www.bancoppel.com/main/index.html
 * Block table: 2 columns. Row 1 = block name. Each subsequent row = one tab:
 *   [ tab label | tab content ].
 * Two tabs: "Promociones" and "Campañas". AEM disallows nested blocks, so each
 * tab's content cell holds default content: for every promo card, its image +
 * H4 title + description paragraph, plus any trailing call-to-action link.
 * The first card of each tab is the "principal"/large card and comes first.
 * Commented-out <custom-card-simple> entries are HTML comments and are ignored
 * (matches the live rendered page).
 */
export default function parse(element, { document }) {
  const navButtons = Array.from(element.querySelectorAll('.nav-tabs .nav-link, ul.nav-tabs button, .nav-tabs button'));
  const panes = Array.from(element.querySelectorAll('.tab-content .tab-pane, .tab-pane'));

  // Map a pane to its tab label. Pane id like "promociones-tab-pane" matches
  // nav button id "promociones-tab"; fall back to positional alignment.
  function labelForPane(pane, index) {
    const btnId = (pane.id || '').replace(/-pane$/, '');
    let btn = btnId ? navButtons.find((b) => b.id === btnId) : null;
    if (!btn) btn = navButtons[index];
    return btn ? btn.textContent.trim() : `Tab ${index + 1}`;
  }

  const cells = [];

  panes.forEach((pane, index) => {
    const label = labelForPane(pane, index);

    const contentCell = [];
    // Each promo card in document order (principal first).
    const cards = Array.from(pane.querySelectorAll('.card.card-simple, .card-simple'));
    cards.forEach((card) => {
      // Prefer the primary responsive image; include the floating badge image too.
      const images = Array.from(card.querySelectorAll('figure img, picture img, img'));
      const heading = card.querySelector('h4, h3, h5');
      const description = card.querySelector('.card-simple__info p, p');
      images.forEach((img) => contentCell.push(img));
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
    });

    // Trailing call-to-action link (e.g. "Ir a Promociones BanCoppel").
    const cta = pane.querySelector(':scope > a[href], a.link-icon[href]');
    if (cta) {
      const href = cta.getAttribute('href');
      const text = cta.textContent.trim();
      if (href && text) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = text;
        contentCell.push(link);
      }
    }

    if (label && contentCell.length) {
      cells.push([label, contentCell]);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-campaigns', cells });
  element.replaceWith(block);
}
