import { toClassName } from '../../scripts/aem.js';

/**
 * Detects a standalone CTA paragraph, e.g. <p><a>Ir a Promociones BanCoppel</a></p>.
 * These are the panel footer links, not part of a promo card.
 */
function isFooterLink(el) {
  if (!el || el.tagName !== 'P') return false;
  const link = el.querySelector('a');
  if (!link) return false;
  return el.children.length === 1
    && link === el.firstElementChild
    && el.textContent.trim() === link.textContent.trim();
}

/**
 * Groups a panel's flat sequence of (h4 + following content) into promo cards.
 * Content images were stripped on import, so each card gets a media placeholder
 * element to preserve the source's image + title + description card proportions.
 * The first card is flagged `principal` (larger / highlighted).
 */
function buildCards(content) {
  const items = [...content.children];
  const cards = document.createElement('div');
  cards.className = 'tabs-campaigns-cards';
  let footer = null;
  let card = null;
  let body = null;

  items.forEach((el) => {
    if (el.tagName === 'H4') {
      card = document.createElement('div');
      card.className = 'tabs-campaigns-card';
      const media = document.createElement('div');
      media.className = 'tabs-campaigns-card-media';
      media.setAttribute('aria-hidden', 'true');
      body = document.createElement('div');
      body.className = 'tabs-campaigns-card-body';
      card.append(media, body);
      body.append(el);
      cards.append(card);
    } else if (card && !isFooterLink(el)) {
      body.append(el);
    } else {
      // trailing standalone CTA link -> panel footer
      footer = el;
    }
  });

  // flag the first card as the large / highlighted "principal" card
  const first = cards.firstElementChild;
  if (first) first.classList.add('principal');

  content.replaceChildren(cards);
  if (footer) {
    footer.className = 'tabs-campaigns-footer';
    const link = footer.querySelector('a');
    if (link) {
      // drop any EDS button auto-decoration so our CTA styling applies cleanly
      link.classList.remove('button', 'primary', 'secondary', 'accent');
      link.classList.add('tabs-campaigns-cta');
    }
    content.append(footer);
  }
}

/**
 * loads and decorates the tabs-campaigns block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-campaigns-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-campaigns-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    // group the panel body into promo cards (content cell = the tab label's sibling)
    const content = tab.nextElementSibling;
    if (content) buildCards(content);

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-campaigns-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tab.innerHTML;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    tab.remove();
  });

  block.prepend(tablist);
}
