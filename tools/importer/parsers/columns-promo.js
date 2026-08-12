/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo. Base: columns.
 * Source: https://www.bancoppel.com/main/index.html
 * Block table: Columns block with 2 columns, one content row: [ LEFT | RIGHT ].
 *   LEFT  = H2 heading + phone mockup image + QR figure (image + caption).
 *   RIGHT = App BanCoppel card (image + H4 + description + Descargar button + Conocer link)
 *           + two stacked App/Banca link rows (icon + H5 + description + link)
 *           + H6 legal disclaimer.
 * AEM disallows nested blocks, so each column holds default content (headings,
 * images, text, links) rather than nested block tables. Custom wrapper elements
 * (custom-card-links, custom-card-icon, custom-boton) are unwrapped so only
 * semantic HTML lands in the cells.
 */
export default function parse(element, { document }) {
  // Replace any <custom-*> wrapper element with its children (in place),
  // and convert <button> inside a link to plain link text, so html2md emits
  // clean headings/paragraphs/links instead of unknown custom elements.
  function cleanup(node) {
    if (!node) return;
    node.querySelectorAll('button').forEach((btn) => {
      btn.replaceWith(document.createTextNode(btn.textContent.trim()));
    });
    // Unwrap custom elements (tag names containing a hyphen), deepest first.
    let changed = true;
    while (changed) {
      changed = false;
      node.querySelectorAll('*').forEach((el) => {
        if (el.tagName && el.tagName.includes('-')) {
          el.replaceWith(...el.childNodes);
          changed = true;
        }
      });
    }
  }

  // LEFT column: heading + mockup + QR figure.
  const left = element.querySelector('.digital--imagen');

  // RIGHT column parts.
  const cardApp = element.querySelector('.digital--card-app');
  const cards = element.querySelector('.digital--cards');
  // Disclaimer: the plain col that is none of the above (holds the H6).
  let disclaimer = null;
  const h6 = element.querySelector('h6');
  if (h6) {
    disclaimer = h6.closest('.col-12') || h6;
    // Guard against selecting one of the known columns.
    if (disclaimer === left || disclaimer === cardApp || disclaimer === cards) {
      disclaimer = h6;
    }
  }

  [left, cardApp, cards, disclaimer].forEach(cleanup);

  const leftCell = [];
  if (left) leftCell.push(left);

  const rightCell = [];
  if (cardApp) rightCell.push(cardApp);
  if (cards) rightCell.push(cards);
  if (disclaimer) rightCell.push(disclaimer);

  if (!leftCell.length && !rightCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[
    leftCell.length ? leftCell : '',
    rightCell.length ? rightCell : '',
  ]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
