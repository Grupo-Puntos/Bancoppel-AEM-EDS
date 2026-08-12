/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-banner. Base: columns.
 * Source: https://www.bancoppel.com/main/index.html
 * Block table: Columns block with 2 columns, one content row: [ LEFT | RIGHT ].
 *   LEFT  = figure/image (security photo + floating badge image).
 *   RIGHT = H2 heading + CTA link "Conocer tips de seguridad".
 */
export default function parse(element, { document }) {
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // LEFT column: the one containing the figure/images.
  const leftCol = columns.find((c) => c.querySelector('figure, img')) || columns[0];
  // RIGHT column: the one containing the heading (distinct from left).
  const rightCol = columns.find((c) => c !== leftCol && c.querySelector('h1, h2, h3, a[href]'))
    || columns.find((c) => c !== leftCol);

  const leftCell = [];
  if (leftCol) {
    const figure = leftCol.querySelector('figure');
    if (figure) leftCell.push(figure);
    else Array.from(leftCol.querySelectorAll('img')).forEach((img) => leftCell.push(img));
  }

  const rightCell = [];
  if (rightCol) {
    const heading = rightCol.querySelector('h1, h2, h3');
    if (heading) rightCell.push(heading);

    const anchor = rightCol.querySelector('a[href]');
    if (anchor) {
      const href = anchor.getAttribute('href');
      const text = anchor.textContent.trim();
      if (href && text) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = text;
        rightCell.push(link);
      }
    }
  }

  if (!leftCell.length && !rightCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[
    leftCell.length ? leftCell : '',
    rightCell.length ? rightCell : '',
  ]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-banner', cells });
  element.replaceWith(block);
}
