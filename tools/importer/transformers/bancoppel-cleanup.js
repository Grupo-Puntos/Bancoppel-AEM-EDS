/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: BanCoppel site-wide cleanup.
 *
 * Removes non-authorable site chrome (header nav, footer), overlay/popup
 * widgets, tracking iframes, swiper control artifacts, and the CSS-hidden
 * blog section so the import contains only page-level authorable content.
 *
 * Runs against `document.body` (both the validation harness and the
 * production import script pass the whole <body> as `element`), so
 * body-level siblings of <main> — header, footer, modals, floating
 * widgets — are all in scope here.
 *
 * ALL selectors below were verified against migration-work/cleaned.html.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / popups / floating widgets — removed before block parsing so
    // they never interfere with block matching. No cookie/consent banner
    // exists in the captured DOM (verified: no cookie/onetrust/gdpr/cybot
    // markup), so none is targeted.
    WebImporter.DOMUtils.remove(element, [
      // <modal-salida> — "Estás a punto de salir del sitio" exit-intent modal.
      'modal-salida',
      // Phone-line promo popup — <div class="modal fade show" id="modal-avisos">
      // ("¡Mantén disponible tu línea telefónica!"). Targeted by id (robust)
      // rather than the positional body > div:nth-of-type(3).
      '#modal-avisos',
      // Login modal — <div class="modal modal-full fade" id="modal-sesion">.
      '#modal-sesion',
      // Leftover Bootstrap modal backdrop overlay from the open modal in the scrape.
      '.modal-backdrop',
      // Zendesk chat floating button — <a class="btn-chat hide-opacity">.
      '.btn-chat',
      // WhatsApp floating button — <a class="btn-whatssap hide-opacity">.
      '.btn-whatssap',
      // "Encuesta" / survey floating button — <span id="kampyleButtonContainer">.
      '#kampyleButtonContainer',
      // Medallia survey animation wrapper (hosts the feedback iframe) —
      // <span id="MDigitalAnimationWrapper">.
      '#MDigitalAnimationWrapper',
    ]);

    // Swiper carousel control artifacts (pagination bullets, prev/next
    // navigation). These are non-content UI controls that sit as siblings of
    // the .swiper-wrapper slide content inside the hero/accesos/productos/
    // campanas/dudas carousels. Removing them before parsing leaves clean
    // slide content for the carousel/cards/tabs parsers.
    WebImporter.DOMUtils.remove(element, [
      '.swiper-pagination',
      '.swiper-navigation',
      '.swiper-button-prev',
      '.swiper-button-next',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome and tracking, removed after block parsing.
    WebImporter.DOMUtils.remove(element, [
      // Global header/navigation — <custom-header> (contains <header class="headerBancoppel">).
      // Migrated separately by the navigation orchestrator; excluded from page body.
      'custom-header',
      // Global footer — <custom-footer> (contains <footer class="footerBancoppel">).
      // Migrated separately by the footer orchestrator; excluded from page body.
      'custom-footer',
      // CSS-hidden blog teaser — <section class="blog"> ("BanCoppel te aconseja").
      // Hidden in the live render and explicitly excluded from the import.
      'section.blog',
      // DoubleClick / analytics tracking iframes (3x) appended at end of body.
      'iframe',
    ]);
  }
}
