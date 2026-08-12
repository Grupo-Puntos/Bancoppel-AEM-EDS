/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-faq. Base: cards.
 * Source: https://www.bancoppel.com/main/index.html
 * Block table: 2 columns. Row 1 = block name. Each subsequent row = one Q&A card:
 *   [ illustration image | H4 question + paragraph answer (inline links preserved) ].
 * A trailing "Ir a Preguntas Frecuentes" CTA link (section-level, outside the
 * cards) is appended to the last card's text cell so it is not lost.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.card.card-simple, .card-simple'));

  const cells = [];

  cards.forEach((card) => {
    const image = card.querySelector('figure img, picture img, img');
    const heading = card.querySelector('.card-simple__info h4, h4, h3, h5');
    // Paragraph answer(s) — keep the elements intact so inline <a> links survive.
    const paragraphs = Array.from(card.querySelectorAll('.card-simple__info p, p'));

    const textCell = [];
    if (heading) textCell.push(heading);
    paragraphs.forEach((p) => textCell.push(p));

    if (image || textCell.length) {
      cells.push([image || '', textCell.length ? textCell : '']);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Trailing CTA ("Ir a Preguntas Frecuentes") appended to the last card cell.
  const cta = element.querySelector('a.link-icon[href], :scope > a[href]');
  if (cta && cells.length) {
    const href = cta.getAttribute('href');
    const text = cta.textContent.trim();
    if (href && text) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = text;
      const lastTextCell = cells[cells.length - 1][1];
      if (Array.isArray(lastTextCell)) lastTextCell.push(link);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-faq', cells });
  element.replaceWith(block);
}
