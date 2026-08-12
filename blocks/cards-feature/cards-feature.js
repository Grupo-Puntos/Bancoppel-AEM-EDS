import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-feature
 * Row 1 = large feature card (h3 title + product image).
 * Rows 2..n = compact cards (small icon + h5 title + short paragraph).
 * Each row authored as [image-cell, text-cell]; images may be absent
 * (stripped on import), so the feature/compact split is detected by
 * heading level (h3 = feature, h5 = compact) rather than by the image.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    // Classify the card: feature carries an h3, compact cards carry an h5.
    const isFeature = !!li.querySelector('h3');
    li.classList.add('cards-feature-item', isFeature ? 'cards-feature-feature' : 'cards-feature-compact');

    // Classify each cell by content: text cell (has heading/paragraph) vs image cell.
    [...li.children].forEach((div) => {
      if (div.querySelector('h1, h2, h3, h4, h5, h6, p')) div.className = 'cards-feature-card-body';
      else div.className = 'cards-feature-card-image';
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img
    .closest('picture')
    .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  block.replaceChildren(ul);
}
