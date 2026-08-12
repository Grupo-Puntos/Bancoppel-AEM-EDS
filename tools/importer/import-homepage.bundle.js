/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".swiper-slide")).filter((slide) => !slide.classList.contains("swiper-slide-duplicate"));
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector(".hero--img img, figure img, picture img, img");
      const info = slide.querySelector(".hero--info") || slide;
      const title = info.querySelector('h1, h2, h3, [class*="title"]');
      const description = info.querySelector("p");
      let cta = null;
      const ctaSource = info.querySelector("a[href]");
      if (ctaSource) {
        const href = ctaSource.getAttribute("href");
        const button = ctaSource.querySelector("button");
        const label = (button ? button.textContent : ctaSource.textContent).trim();
        if (href && label) {
          cta = document.createElement("a");
          cta.setAttribute("href", href);
          cta.textContent = label;
        }
      }
      const contentCell = [];
      if (title) contentCell.push(title);
      if (description) contentCell.push(description);
      if (cta) contentCell.push(cta);
      if (image || contentCell.length) {
        cells.push([image || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-quicklink.js
  function parse2(element, { document }) {
    const tiles = Array.from(element.querySelectorAll(".swiper-slide")).filter((tile) => !tile.classList.contains("swiper-slide-duplicate"));
    const cells = [];
    tiles.forEach((tile) => {
      const image = tile.querySelector("picture img, img");
      const anchor = tile.querySelector("a[href]");
      const heading = tile.querySelector("h5, h4, h6, .contenido h5");
      const href = anchor ? anchor.getAttribute("href") : null;
      const label = (heading ? heading.textContent : anchor ? anchor.textContent : "").trim();
      let labelCell = "";
      if (label) {
        const h5 = document.createElement("h5");
        if (href) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
          link.textContent = label;
          h5.appendChild(link);
        } else {
          h5.textContent = label;
        }
        labelCell = h5;
      }
      if (image || labelCell) {
        cells.push([image || "", labelCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-quicklink", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse3(element, { document }) {
    function cleanup(node) {
      if (!node) return;
      node.querySelectorAll("button").forEach((btn) => {
        btn.replaceWith(document.createTextNode(btn.textContent.trim()));
      });
      let changed = true;
      while (changed) {
        changed = false;
        node.querySelectorAll("*").forEach((el) => {
          if (el.tagName && el.tagName.includes("-")) {
            el.replaceWith(...el.childNodes);
            changed = true;
          }
        });
      }
    }
    const left = element.querySelector(".digital--imagen");
    const cardApp = element.querySelector(".digital--card-app");
    const cards = element.querySelector(".digital--cards");
    let disclaimer = null;
    const h6 = element.querySelector("h6");
    if (h6) {
      disclaimer = h6.closest(".col-12") || h6;
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
      leftCell.length ? leftCell : "",
      rightCell.length ? rightCell : ""
    ]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse4(element, { document }) {
    const cells = [];
    function linkifyHeading(heading, href) {
      if (!heading || !href) return heading;
      const link = document.createElement("a");
      link.setAttribute("href", href);
      while (heading.firstChild) link.appendChild(heading.firstChild);
      heading.appendChild(link);
      return heading;
    }
    const feature = element.querySelector(".productos--tarjeta");
    if (feature) {
      const anchor = feature.querySelector("a[href]");
      const href = anchor ? anchor.getAttribute("href").trim() : null;
      const h3 = feature.querySelector("h3");
      const images = Array.from(feature.querySelectorAll("img"));
      const textCell = [];
      if (h3) textCell.push(linkifyHeading(h3, href));
      cells.push([
        images.length ? images : "",
        textCell.length ? textCell : ""
      ]);
    }
    const compactSlides = Array.from(element.querySelectorAll(".productos--slider .swiper-slide, .swiper-productos .swiper-slide")).filter((slide) => !slide.classList.contains("swiper-slide-duplicate"));
    compactSlides.forEach((slide) => {
      const image = slide.querySelector("picture img, img");
      const heading = slide.querySelector("h5, h4, h6");
      const description = slide.querySelector(".contenido p, p");
      const anchor = slide.querySelector("a[href]");
      const href = anchor ? anchor.getAttribute("href").trim() : null;
      const textCell = [];
      if (heading) textCell.push(linkifyHeading(heading, href));
      if (description) textCell.push(description);
      if (image || textCell.length) {
        cells.push([image || "", textCell.length ? textCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const sectionHeading = element.querySelector(":scope > .col-12 > h2, h2.title-underline");
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
    if (sectionHeading) block.before(sectionHeading);
  }

  // tools/importer/parsers/tabs-campaigns.js
  function parse5(element, { document }) {
    const navButtons = Array.from(element.querySelectorAll(".nav-tabs .nav-link, ul.nav-tabs button, .nav-tabs button"));
    const panes = Array.from(element.querySelectorAll(".tab-content .tab-pane, .tab-pane"));
    function labelForPane(pane, index) {
      const btnId = (pane.id || "").replace(/-pane$/, "");
      let btn = btnId ? navButtons.find((b) => b.id === btnId) : null;
      if (!btn) btn = navButtons[index];
      return btn ? btn.textContent.trim() : `Tab ${index + 1}`;
    }
    const cells = [];
    panes.forEach((pane, index) => {
      const label = labelForPane(pane, index);
      const contentCell = [];
      const cards = Array.from(pane.querySelectorAll(".card.card-simple, .card-simple"));
      cards.forEach((card) => {
        const images = Array.from(card.querySelectorAll("figure img, picture img, img"));
        const heading = card.querySelector("h4, h3, h5");
        const description = card.querySelector(".card-simple__info p, p");
        images.forEach((img) => contentCell.push(img));
        if (heading) contentCell.push(heading);
        if (description) contentCell.push(description);
      });
      const cta = pane.querySelector(":scope > a[href], a.link-icon[href]");
      if (cta) {
        const href = cta.getAttribute("href");
        const text = cta.textContent.trim();
        if (href && text) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
          link.textContent = text;
          contentCell.push(link);
        }
      }
      if (label && contentCell.length) {
        cells.push([label, contentCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-campaigns", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-banner.js
  function parse6(element, { document }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const leftCol = columns.find((c) => c.querySelector("figure, img")) || columns[0];
    const rightCol = columns.find((c) => c !== leftCol && c.querySelector("h1, h2, h3, a[href]")) || columns.find((c) => c !== leftCol);
    const leftCell = [];
    if (leftCol) {
      const figure = leftCol.querySelector("figure");
      if (figure) leftCell.push(figure);
      else Array.from(leftCol.querySelectorAll("img")).forEach((img) => leftCell.push(img));
    }
    const rightCell = [];
    if (rightCol) {
      const heading = rightCol.querySelector("h1, h2, h3");
      if (heading) rightCell.push(heading);
      const anchor = rightCol.querySelector("a[href]");
      if (anchor) {
        const href = anchor.getAttribute("href");
        const text = anchor.textContent.trim();
        if (href && text) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
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
      leftCell.length ? leftCell : "",
      rightCell.length ? rightCell : ""
    ]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-faq.js
  function parse7(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".card.card-simple, .card-simple"));
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector("figure img, picture img, img");
      const heading = card.querySelector(".card-simple__info h4, h4, h3, h5");
      const paragraphs = Array.from(card.querySelectorAll(".card-simple__info p, p"));
      const textCell = [];
      if (heading) textCell.push(heading);
      paragraphs.forEach((p) => textCell.push(p));
      if (image || textCell.length) {
        cells.push([image || "", textCell.length ? textCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cta = element.querySelector("a.link-icon[href], :scope > a[href]");
    if (cta && cells.length) {
      const href = cta.getAttribute("href");
      const text = cta.textContent.trim();
      if (href && text) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = text;
        const lastTextCell = cells[cells.length - 1][1];
        if (Array.isArray(lastTextCell)) lastTextCell.push(link);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-seo.js
  function parse8(element, { document }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const cells = [];
    const row = [];
    columns.forEach((col) => {
      const items = Array.from(col.querySelectorAll(".seo__item"));
      const cellContent = items.length ? items : Array.from(col.children);
      row.push(cellContent.length ? cellContent : "");
    });
    if (row.length === 0 || row.every((c) => c === "")) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push(row);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-seo", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/bancoppel-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        // <modal-salida> — "Estás a punto de salir del sitio" exit-intent modal.
        "modal-salida",
        // Phone-line promo popup — <div class="modal fade show" id="modal-avisos">
        // ("¡Mantén disponible tu línea telefónica!"). Targeted by id (robust)
        // rather than the positional body > div:nth-of-type(3).
        "#modal-avisos",
        // Login modal — <div class="modal modal-full fade" id="modal-sesion">.
        "#modal-sesion",
        // Leftover Bootstrap modal backdrop overlay from the open modal in the scrape.
        ".modal-backdrop",
        // Zendesk chat floating button — <a class="btn-chat hide-opacity">.
        ".btn-chat",
        // WhatsApp floating button — <a class="btn-whatssap hide-opacity">.
        ".btn-whatssap",
        // "Encuesta" / survey floating button — <span id="kampyleButtonContainer">.
        "#kampyleButtonContainer",
        // Medallia survey animation wrapper (hosts the feedback iframe) —
        // <span id="MDigitalAnimationWrapper">.
        "#MDigitalAnimationWrapper"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".swiper-pagination",
        ".swiper-navigation",
        ".swiper-button-prev",
        ".swiper-button-next"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Global header/navigation — <custom-header> (contains <header class="headerBancoppel">).
        // Migrated separately by the navigation orchestrator; excluded from page body.
        "custom-header",
        // Global footer — <custom-footer> (contains <footer class="footerBancoppel">).
        // Migrated separately by the footer orchestrator; excluded from page body.
        "custom-footer",
        // CSS-hidden blog teaser — <section class="blog"> ("BanCoppel te aconseja").
        // Hidden in the live render and explicitly excluded from the import.
        "section.blog",
        // DoubleClick / analytics tracking iframes (3x) appended at end of body.
        "iframe"
      ]);
    }
  }

  // tools/importer/transformers/bancoppel-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function findSectionElement(element, selector) {
    const candidates = Array.isArray(selector) ? selector : [selector];
    for (const sel of candidates) {
      if (!sel) continue;
      const found = element.querySelector(sel);
      if (found) return found;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const document = element.ownerDocument;
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section) continue;
      const sectionEl = findSectionElement(element, section.selector);
      if (!sectionEl) {
        console.warn("Section not found for selector:", JSON.stringify(section.selector));
        continue;
      }
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        sectionEl.append(metadataBlock);
      }
      if (i > 0 && sectionEl.previousElementSibling) {
        const hr = document.createElement("hr");
        sectionEl.before(hr);
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "BanCoppel homepage: hero carousel, quick-access link tiles, app/banca digital promo, product possibilities cards, promotions/campaigns tabs, security banner, FAQ teaser, and SEO link block.",
    urls: [
      "https://www.bancoppel.com/main/index.html"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [
          "section.section-hero-home div.swiper.swiper-hero",
          ".section-hero-home .swiper-hero"
        ]
      },
      {
        name: "cards-quicklink",
        instances: [
          "section.accesos div.swiper.swiper-accesos",
          ".accesos .swiper-accesos"
        ]
      },
      {
        name: "columns-promo",
        instances: [
          "section.digital > div.custom-container > div.row",
          ".digital .row"
        ]
      },
      {
        name: "cards-feature",
        instances: [
          "section.productos > div.custom-container > div.row",
          ".productos .row"
        ]
      },
      {
        name: "tabs-campaigns",
        instances: [
          "section.campanas div.custom-container.container-slide",
          ".campanas .container-slide"
        ]
      },
      {
        name: "columns-banner",
        instances: [
          "section.seguridad > div.custom-container > div.row",
          ".seguridad .row"
        ]
      },
      {
        name: "cards-faq",
        instances: [
          "section.dudas div.custom-container.container-slide",
          ".dudas .container-slide"
        ]
      },
      {
        name: "columns-seo",
        instances: [
          "section.seo > div.custom-container > div.row",
          ".seo .row"
        ]
      }
    ],
    sections: [
      { id: "section-hero-home", name: "Hero Carousel", selector: ["body > main.home > section.section-hero-home", "section.section-hero-home"], style: null, blocks: ["carousel-hero"], defaultContent: [] },
      { id: "accesos", name: "Quick Access Links", selector: ["body > main.home > section.accesos", "section.accesos"], style: null, blocks: ["cards-quicklink"], defaultContent: ["section.accesos h1.title-underline"] },
      { id: "digital", name: "App & Banca Digital", selector: ["body > main.home > section.digital", "section.digital"], style: null, blocks: ["columns-promo"], defaultContent: [] },
      { id: "productos", name: "Product Possibilities", selector: ["body > main.home > section.productos", "section.productos"], style: "grey", blocks: ["cards-feature"], defaultContent: ["section.productos h2.title-underline"] },
      { id: "campanas", name: "Promotions & Campaigns Tabs", selector: ["body > main.home > section.campanas", "section.campanas"], style: null, blocks: ["tabs-campaigns"], defaultContent: ["section.campanas h2.title-underline"] },
      { id: "seguridad", name: "Security Banner", selector: ["body > main.home > section.seguridad", "section.seguridad"], style: "grey", blocks: ["columns-banner"], defaultContent: [] },
      { id: "dudas", name: "FAQ Teaser", selector: ["body > main.home > section.dudas", "section.dudas"], style: null, blocks: ["cards-faq"], defaultContent: ["section.dudas h2.title-underline"] },
      { id: "seo", name: "SEO Link Block", selector: ["body > main.home > section.seo", "section.seo"], style: null, blocks: ["columns-seo"], defaultContent: [] }
    ]
  };
  var parsers = {
    "carousel-hero": parse,
    "cards-quicklink": parse2,
    "columns-promo": parse3,
    "cards-feature": parse4,
    "tabs-campaigns": parse5,
    "columns-banner": parse6,
    "cards-faq": parse7,
    "columns-seo": parse8
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      let matched = false;
      blockDef.instances.forEach((selector) => {
        if (matched) return;
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;
        elements.forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
        matched = true;
      });
      if (!matched) {
        console.warn(`Block "${blockDef.name}" not found via any selector: ${blockDef.instances.join(", ")}`);
      }
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
