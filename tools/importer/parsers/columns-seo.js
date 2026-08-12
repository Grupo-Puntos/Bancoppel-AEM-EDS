/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-seo. Base: columns.
 * Source: https://www.bancoppel.com/main/index.html
 * Block table: Columns block with 2 columns, one content row: [ LEFT | RIGHT ].
 * Two text columns; each column holds 3 groupings of H5 subheading + paragraph
 * with inline links. Text-only, no images. All inline links are preserved.
 */
export default function parse(element, { document }) {
  // Each direct column is a .col-* wrapper holding .seo__item groupings.
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];
  const row = [];

  columns.forEach((col) => {
    const items = Array.from(col.querySelectorAll('.seo__item'));
    const cellContent = items.length ? items : Array.from(col.children);
    row.push(cellContent.length ? cellContent : '');
  });

  // Guard: expect two columns; if the structure is unexpected, bail gracefully.
  if (row.length === 0 || row.every((c) => c === '' )) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push(row);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-seo', cells });
  element.replaceWith(block);
}
