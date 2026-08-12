/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://www.bancoppel.com/main/index.html
 * Block table: 2 columns. Row 1 = block name. Each subsequent row = one slide:
 *   [ hero image | title (H2) + description (p) + CTA link ].
 */
export default function parse(element, { document }) {
  // Each slide lives in the swiper wrapper; skip loop-generated duplicates.
  const slides = Array.from(element.querySelectorAll('.swiper-slide'))
    .filter((slide) => !slide.classList.contains('swiper-slide-duplicate'));

  const cells = [];

  slides.forEach((slide) => {
    // Column 1: hero image (absolute https src preserved as-is).
    const image = slide.querySelector('.hero--img img, figure img, picture img, img');

    // Column 2: title + description + CTA.
    const info = slide.querySelector('.hero--info') || slide;
    const title = info.querySelector('h1, h2, h3, [class*="title"]');
    const description = info.querySelector('p');

    // CTA is an <a> wrapping a <custom-boton><button>; rebuild as a clean link.
    let cta = null;
    const ctaSource = info.querySelector('a[href]');
    if (ctaSource) {
      const href = ctaSource.getAttribute('href');
      const button = ctaSource.querySelector('button');
      const label = (button ? button.textContent : ctaSource.textContent).trim();
      if (href && label) {
        cta = document.createElement('a');
        cta.setAttribute('href', href);
        cta.textContent = label;
      }
    }

    const contentCell = [];
    if (title) contentCell.push(title);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);

    // Only emit a slide row if it has an image or textual content.
    if (image || contentCell.length) {
      cells.push([image || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard: nothing meaningful extracted.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
