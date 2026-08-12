/**
 * columns-banner
 * Side-by-side security banner: image/figure column + heading & CTA column.
 * The source image is often stripped during import, so the image cell may be
 * empty. We tag it as a placeholder so the layout keeps its two-column
 * proportion (see columns-banner.css) instead of collapsing.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const rows = [...block.children];
  const cols = rows[0] ? [...rows[0].children] : [];
  block.classList.add(`columns-banner-${cols.length}-cols`);

  rows.forEach((row) => {
    [...row.children].forEach((col) => {
      const media = col.querySelector('picture, img');
      const hasText = col.textContent.trim().length > 0;

      if (media) {
        // real image column
        col.classList.add('columns-banner-img-col');
      } else if (!hasText) {
        // empty cell (image stripped on import) -> graceful placeholder
        col.classList.add('columns-banner-img-col', 'columns-banner-img-placeholder');
      } else {
        // heading + CTA column
        col.classList.add('columns-banner-text-col');
      }
    });
  });
}
