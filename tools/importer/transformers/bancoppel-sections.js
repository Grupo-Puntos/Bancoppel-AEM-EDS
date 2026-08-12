/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: BanCoppel section breaks + section metadata.
 *
 * Adds EDS section structure to the homepage from the template's `sections`
 * definition (page-templates.json): a `<hr>` before every section except the
 * first (section break), and a "Section Metadata" block for every section
 * that declares a `style` (productos → grey, seguridad → grey).
 *
 * Runs in afterTransform ONLY, so it executes after the cleanup transformer
 * (which removes the header/footer and the excluded section.blog) and after
 * the block parsers have converted block instances to tables. It reads
 * `payload.template.sections`.
 *
 * Section selectors come from the template (validated against
 * migration-work/cleaned.html): each section's `selector` is an array of
 * candidate selectors, tried in order until one matches.
 *
 * Sections are processed in reverse document order so that inserting a
 * `<hr>` before one section never shifts the position of sections still to
 * be processed.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

/**
 * Resolve a section element from its (possibly array-valued) selector.
 * @param {Element} element root to search within (document.body)
 * @param {string|string[]} selector one selector or an ordered list of candidates
 * @returns {Element|null}
 */
function findSectionElement(element, selector) {
  const candidates = Array.isArray(selector) ? selector : [selector];
  for (const sel of candidates) {
    if (!sel) continue;
    const found = element.querySelector(sel);
    if (found) return found;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;

  const document = element.ownerDocument;

  // Reverse order: later insertions don't disturb earlier sections' positions.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    if (!section) continue;

    const sectionEl = findSectionElement(element, section.selector);
    if (!sectionEl) {
      // eslint-disable-next-line no-console
      console.warn('Section not found for selector:', JSON.stringify(section.selector));
      continue;
    }

    // Section Metadata block for styled sections. Appended as the last child
    // of the section so it falls within this section's boundary (between the
    // <hr> that opens the section and the <hr> that opens the next one).
    if (section.style) {
      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      sectionEl.append(metadataBlock);
    }

    // Section break before every section except the first, and only when
    // there is preceding content (guards against a leading <hr>).
    if (i > 0 && sectionEl.previousElementSibling) {
      const hr = document.createElement('hr');
      sectionEl.before(hr);
    }
  }
}
