import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Returns true when a cell holds only a single standalone link
 * (a <p> wrapping just an <a>), used for the trailing "Ir a ..." link.
 */
function isStandaloneLinkParagraph(p) {
  return p.tagName === 'P'
    && p.children.length === 1
    && p.firstElementChild.tagName === 'A'
    && p.textContent.trim() === p.firstElementChild.textContent.trim();
}

export default function decorate(block) {
  // change rows/cells to ul/li
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div, i) => {
      // first cell is the illustration/image area (may be empty after import);
      // remaining cell(s) hold the question + answer
      if (i === 0 && (div.querySelector('picture') || div.children.length === 0)) {
        div.className = 'cards-faq-card-image';
      } else {
        div.className = 'cards-faq-card-body';
      }
    });
    ul.append(li);
  });

  // optimize any authored images
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  // Pull the trailing standalone link ("Ir a Preguntas Frecuentes") out of the
  // last card and present it as a centered, section-level link below the cards.
  let trailing;
  const lastBody = [...ul.querySelectorAll('.cards-faq-card-body')].pop();
  if (lastBody) {
    const linkParagraph = [...lastBody.querySelectorAll('p')].find(isStandaloneLinkParagraph);
    if (linkParagraph) {
      trailing = document.createElement('div');
      trailing.className = 'cards-faq-trailing';
      trailing.append(linkParagraph.firstElementChild);
      linkParagraph.remove();
    }
  }

  block.replaceChildren(ul);
  if (trailing) block.append(trailing);
}
