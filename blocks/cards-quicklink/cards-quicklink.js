import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Quick-link tiles: a row of compact cards. Each card = an icon slot (left) +
 * a short label (right). The WHOLE tile is a single clickable link.
 *
 * Authored structure (per row): [ icon cell ][ text cell: <h5><a>label</a></h5> ].
 * The icon cell may be empty (content images stripped on import) — we still
 * reserve a graceful icon slot so tiles never collapse.
 * @param {Element} block
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cells = [...row.children];

    // First cell is the icon slot (even when empty); the rest is the body.
    const iconCell = cells.shift();
    if (iconCell) iconCell.className = 'cards-quicklink-card-image';
    const bodyCells = cells;
    bodyCells.forEach((div) => { div.className = 'cards-quicklink-card-body'; });

    // Destination = the label's link (inside the h5) or any link in the row.
    const sourceLink = [iconCell, ...bodyCells]
      .filter(Boolean)
      .map((el) => el.querySelector('a[href]'))
      .find(Boolean);

    if (sourceLink) {
      // Wrap the whole tile in one anchor so the entire card is clickable.
      const tile = document.createElement('a');
      tile.className = 'cards-quicklink-link';
      tile.href = sourceLink.getAttribute('href');
      if (sourceLink.target) tile.target = sourceLink.target;
      tile.setAttribute('aria-label', sourceLink.textContent.trim());

      // Unwrap the inner label link (avoid nested anchors) -> keep just text.
      const labelHeading = sourceLink.closest('h5');
      if (labelHeading) labelHeading.textContent = sourceLink.textContent.trim();

      if (iconCell) tile.append(iconCell);
      bodyCells.forEach((div) => tile.append(div));
      li.append(tile);
    } else {
      if (iconCell) li.append(iconCell);
      bodyCells.forEach((div) => li.append(div));
    }

    ul.append(li);
  });

  // Optimize any real icon images that survive import.
  ul.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }])));

  block.replaceChildren(ul);
}
