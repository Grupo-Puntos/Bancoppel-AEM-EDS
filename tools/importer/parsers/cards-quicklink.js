/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-quicklink. Base: cards.
 * Source: https://www.bancoppel.com/main/index.html
 * Block table: 2 columns. Row 1 = block name. Each subsequent row = one quick-link tile:
 *   [ icon image | H5 label rendered as a link (the tile href) ].
 * Each source tile is an <a href> wrapping an icon <img> and an <h5> label (no body text).
 */
export default function parse(element, { document }) {
  const tiles = Array.from(element.querySelectorAll('.swiper-slide'))
    .filter((tile) => !tile.classList.contains('swiper-slide-duplicate'));

  const cells = [];

  tiles.forEach((tile) => {
    // Column 1: icon image.
    const image = tile.querySelector('picture img, img');

    // Column 2: H5 label wrapped in the tile's link.
    const anchor = tile.querySelector('a[href]');
    const heading = tile.querySelector('h5, h4, h6, .contenido h5');
    const href = anchor ? anchor.getAttribute('href') : null;
    const label = (heading ? heading.textContent : (anchor ? anchor.textContent : '')).trim();

    let labelCell = '';
    if (label) {
      const h5 = document.createElement('h5');
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = label;
        h5.appendChild(link);
      } else {
        h5.textContent = label;
      }
      labelCell = h5;
    }

    if (image || labelCell) {
      cells.push([image || '', labelCell]);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-quicklink', cells });
  element.replaceWith(block);
}
