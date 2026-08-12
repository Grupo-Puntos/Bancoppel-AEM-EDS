/**
 * columns-promo
 * Two-column app-promo block.
 *  LEFT  (media panel): H2 heading, phone-mockup slot, QR figure + caption.
 *  RIGHT (content):     App promo card, App/Banca link rows, legal disclaimer.
 *
 * The import parser duplicated the link rows and emitted many empty <a>
 * paragraphs. This decorator de-duplicates repeated rows (by heading text),
 * drops the empty links, and rebuilds a clean, semantic structure.
 * Content images were stripped on import, so decorative placeholders are used.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;

  const cells = [...firstRow.children];
  const leftCell = cells[0];
  const rightCell = cells[1];

  // ------------------------------------------------------------------
  // LEFT: media panel (heading + phone mockup slot + QR figure)
  // ------------------------------------------------------------------
  if (leftCell) {
    leftCell.classList.add('columns-promo-media');
    const heading = leftCell.querySelector('h1, h2, h3');
    const caption = leftCell.querySelector('p');

    // phone-mockup placeholder (source image was stripped on import)
    const mockup = document.createElement('div');
    mockup.className = 'columns-promo-mockup';
    mockup.setAttribute('aria-hidden', 'true');

    // QR figure: placeholder tile + caption
    const figure = document.createElement('figure');
    figure.className = 'columns-promo-qr';
    const qrCode = document.createElement('div');
    qrCode.className = 'columns-promo-qr-code';
    qrCode.setAttribute('aria-hidden', 'true');
    figure.append(qrCode);
    if (caption) {
      const figcaption = document.createElement('figcaption');
      figcaption.innerHTML = caption.innerHTML;
      figure.append(figcaption);
      caption.remove();
    }

    if (heading) heading.after(mockup);
    else leftCell.prepend(mockup);
    leftCell.append(figure);
  }

  // ------------------------------------------------------------------
  // RIGHT: de-duplicate the messy import output, then rebuild
  // ------------------------------------------------------------------
  if (rightCell) {
    rightCell.classList.add('columns-promo-content');

    // 1. Drop empty paragraphs / empty links produced by the parser.
    rightCell.querySelectorAll('a').forEach((a) => {
      if (!a.textContent.trim() && !a.querySelector('img, picture')) a.remove();
    });
    rightCell.querySelectorAll('p').forEach((p) => {
      if (!p.textContent.trim() && !p.querySelector('img, picture')) p.remove();
    });

    // 2. Partition the flat child sequence:
    //    - everything before the first <h5> = promo card
    //    - each <h5> starts a link row (runs until the next <h5>/<h6>)
    //    - <h6> = legal disclaimer
    const cardParts = [];
    const groups = [];
    let disclaimer = null;
    let current = null;
    let inRows = false;

    [...rightCell.children].forEach((el) => {
      const tag = el.tagName;
      if (tag === 'H6') {
        disclaimer = el;
      } else if (tag === 'H5') {
        inRows = true;
        current = { key: el.textContent.trim().toLowerCase(), heading: el, parts: [] };
        groups.push(current);
      } else if (!inRows) {
        cardParts.push(el);
      } else if (current) {
        current.parts.push(el);
      }
    });

    // 3. De-duplicate rows by heading text (keep first occurrence).
    const seen = new Set();
    const uniqueGroups = groups.filter((g) => {
      if (seen.has(g.key)) return false;
      seen.add(g.key);
      return true;
    });

    // Detach originals, then rebuild the clean structure.
    rightCell.textContent = '';

    // 3a. Promo card (image banner + heading + copy + Descargar button + link)
    if (cardParts.length) {
      const card = document.createElement('div');
      card.className = 'columns-promo-card';

      const cardImg = document.createElement('div');
      cardImg.className = 'columns-promo-card-img';
      cardImg.setAttribute('aria-hidden', 'true');

      const body = document.createElement('div');
      body.className = 'columns-promo-card-body';
      cardParts.forEach((el) => body.append(el));

      // First action link = primary "Descargar" button; the rest = text links.
      const links = [...body.querySelectorAll('a')];
      links.forEach((a, i) => {
        if (i === 0) a.classList.add('button');
        else a.classList.add('columns-promo-card-link');
      });
      // Tag the paragraph that holds the action links for layout.
      if (links[0]) {
        const actionPara = links[0].closest('p');
        if (actionPara) actionPara.classList.add('columns-promo-card-actions');
      }

      card.append(cardImg, body);
      rightCell.append(card);
    }

    // 3b. Link rows (grey icon circle + heading + copy + "Conocer" link)
    uniqueGroups.forEach((g) => {
      const row = document.createElement('div');
      row.className = 'columns-promo-linkrow';

      const icon = document.createElement('span');
      icon.className = 'columns-promo-icon';
      icon.setAttribute('aria-hidden', 'true');

      const rbody = document.createElement('div');
      rbody.className = 'columns-promo-linkrow-body';

      // Heading: unwrap the auto-generated inner link to plain text.
      const headingLink = g.heading.querySelector('a');
      if (headingLink) g.heading.textContent = headingLink.textContent.trim();
      rbody.append(g.heading);

      g.parts.forEach((p, i) => {
        const isLast = i === g.parts.length - 1;
        const a = p.querySelector('a');
        if (isLast && a && /conocer/i.test(a.textContent)) {
          a.classList.add('columns-promo-linkrow-link');
          rbody.append(a);
        } else {
          // Descriptive copy: unwrap link to plain text.
          if (a) p.textContent = a.textContent.trim();
          rbody.append(p);
        }
      });

      row.append(icon, rbody);
      rightCell.append(row);
    });

    // 3c. Legal disclaimer at the end.
    if (disclaimer) rightCell.append(disclaimer);
  }
}
