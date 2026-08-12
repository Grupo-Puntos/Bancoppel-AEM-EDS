/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS - one per block variant in the homepage template
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsQuicklinkParser from './parsers/cards-quicklink.js';
import columnsPromoParser from './parsers/columns-promo.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import tabsCampaignsParser from './parsers/tabs-campaigns.js';
import columnsBannerParser from './parsers/columns-banner.js';
import cardsFaqParser from './parsers/cards-faq.js';
import columnsSeoParser from './parsers/columns-seo.js';

// TRANSFORMER IMPORTS - site-wide cleanup + section breaks/metadata
import cleanupTransformer from './transformers/bancoppel-cleanup.js';
import sectionsTransformer from './transformers/bancoppel-sections.js';

// PAGE TEMPLATE CONFIGURATION - embedded from page-templates.json (homepage)
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'BanCoppel homepage: hero carousel, quick-access link tiles, app/banca digital promo, product possibilities cards, promotions/campaigns tabs, security banner, FAQ teaser, and SEO link block.',
  urls: [
    'https://www.bancoppel.com/main/index.html',
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: [
        'section.section-hero-home div.swiper.swiper-hero',
        '.section-hero-home .swiper-hero',
      ],
    },
    {
      name: 'cards-quicklink',
      instances: [
        'section.accesos div.swiper.swiper-accesos',
        '.accesos .swiper-accesos',
      ],
    },
    {
      name: 'columns-promo',
      instances: [
        'section.digital > div.custom-container > div.row',
        '.digital .row',
      ],
    },
    {
      name: 'cards-feature',
      instances: [
        'section.productos > div.custom-container > div.row',
        '.productos .row',
      ],
    },
    {
      name: 'tabs-campaigns',
      instances: [
        'section.campanas div.custom-container.container-slide',
        '.campanas .container-slide',
      ],
    },
    {
      name: 'columns-banner',
      instances: [
        'section.seguridad > div.custom-container > div.row',
        '.seguridad .row',
      ],
    },
    {
      name: 'cards-faq',
      instances: [
        'section.dudas div.custom-container.container-slide',
        '.dudas .container-slide',
      ],
    },
    {
      name: 'columns-seo',
      instances: [
        'section.seo > div.custom-container > div.row',
        '.seo .row',
      ],
    },
  ],
  sections: [
    { id: 'section-hero-home', name: 'Hero Carousel', selector: ['body > main.home > section.section-hero-home', 'section.section-hero-home'], style: null, blocks: ['carousel-hero'], defaultContent: [] },
    { id: 'accesos', name: 'Quick Access Links', selector: ['body > main.home > section.accesos', 'section.accesos'], style: null, blocks: ['cards-quicklink'], defaultContent: ['section.accesos h1.title-underline'] },
    { id: 'digital', name: 'App & Banca Digital', selector: ['body > main.home > section.digital', 'section.digital'], style: null, blocks: ['columns-promo'], defaultContent: [] },
    { id: 'productos', name: 'Product Possibilities', selector: ['body > main.home > section.productos', 'section.productos'], style: 'grey', blocks: ['cards-feature'], defaultContent: ['section.productos h2.title-underline'] },
    { id: 'campanas', name: 'Promotions & Campaigns Tabs', selector: ['body > main.home > section.campanas', 'section.campanas'], style: null, blocks: ['tabs-campaigns'], defaultContent: ['section.campanas h2.title-underline'] },
    { id: 'seguridad', name: 'Security Banner', selector: ['body > main.home > section.seguridad', 'section.seguridad'], style: 'grey', blocks: ['columns-banner'], defaultContent: [] },
    { id: 'dudas', name: 'FAQ Teaser', selector: ['body > main.home > section.dudas', 'section.dudas'], style: null, blocks: ['cards-faq'], defaultContent: ['section.dudas h2.title-underline'] },
    { id: 'seo', name: 'SEO Link Block', selector: ['body > main.home > section.seo', 'section.seo'], style: null, blocks: ['columns-seo'], defaultContent: [] },
  ],
};

// PARSER REGISTRY - map block name to parser function
const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-quicklink': cardsQuicklinkParser,
  'columns-promo': columnsPromoParser,
  'cards-feature': cardsFeatureParser,
  'tabs-campaigns': tabsCampaignsParser,
  'columns-banner': columnsBannerParser,
  'cards-faq': cardsFaqParser,
  'columns-seo': columnsSeoParser,
};

// TRANSFORMER REGISTRY - cleanup runs first, then section breaks/metadata
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform (document.body)
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all block instances on the page based on the embedded template.
 * The first matching selector per block wins (avoids duplicate parsing of the
 * same block via the fallback selector).
 * @param {Document} document
 * @param {Object} template
 * @returns {Array<{name:string, selector:string, element:Element, section:?string}>}
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();

  template.blocks.forEach((blockDef) => {
    let matched = false;
    blockDef.instances.forEach((selector) => {
      if (matched) return; // first matching selector for this block wins
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) return;
      elements.forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
      matched = true;
    });
    if (!matched) {
      console.warn(`Block "${blockDef.name}" not found via any selector: ${blockDef.instances.join(', ')}`);
    }
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform - initial cleanup (remove chrome, overlays, swiper controls)
    executeTransformers('beforeTransform', main, payload);

    // 2. Discover blocks on the page from the embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using its registered parser
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced by an earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform - final cleanup + section breaks/metadata (header/footer/blog removal)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized document path (map root/homepage URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
