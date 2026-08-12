/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base: cards.
 * Source: https://www.bancoppel.com/main/index.html
 * Block table: 2 columns. Row 1 = block name. Each subsequent row = one card:
 *   [ image | heading (as link) + description ].
 * Row order: the large feature card first (H3 + product image, linked), then the
 *   3 compact cards (icon image + H5 + paragraph, each linked).
 * The section title (H2 "BanCoppel te da posibilidades") lives inside the same
 *   .row but is section default content, not a card — it is preserved as a
 *   heading placed before the block so it is not lost when .row is replaced.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Helper: wrap a heading's contents in an anchor so the card is "linked".
  function linkifyHeading(heading, href) {
    if (!heading || !href) return heading;
    const link = document.createElement('a');
    link.setAttribute('href', href);
    while (heading.firstChild) link.appendChild(heading.firstChild);
    heading.appendChild(link);
    return heading;
  }

  // --- Feature card (large): .productos--tarjeta ---
  const feature = element.querySelector('.productos--tarjeta');
  if (feature) {
    const anchor = feature.querySelector('a[href]');
    const href = anchor ? anchor.getAttribute('href').trim() : null;
    const h3 = feature.querySelector('h3');
    const images = Array.from(feature.querySelectorAll('img'));

    const textCell = [];
    if (h3) textCell.push(linkifyHeading(h3, href));

    cells.push([
      images.length ? images : '',
      textCell.length ? textCell : '',
    ]);
  }

  // --- Compact cards (3): slides inside the products slider ---
  const compactSlides = Array.from(element.querySelectorAll('.productos--slider .swiper-slide, .swiper-productos .swiper-slide'))
    .filter((slide) => !slide.classList.contains('swiper-slide-duplicate'));

  compactSlides.forEach((slide) => {
    const image = slide.querySelector('picture img, img');
    const heading = slide.querySelector('h5, h4, h6');
    const description = slide.querySelector('.contenido p, p');
    const anchor = slide.querySelector('a[href]');
    const href = anchor ? anchor.getAttribute('href').trim() : null;

    const textCell = [];
    if (heading) textCell.push(linkifyHeading(heading, href));
    if (description) textCell.push(description);

    if (image || textCell.length) {
      cells.push([image || '', textCell.length ? textCell : '']);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Preserve the section title (default content) that shares this .row.
  const sectionHeading = element.querySelector(':scope > .col-12 > h2, h2.title-underline');

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
  if (sectionHeading) block.before(sectionHeading);
}
