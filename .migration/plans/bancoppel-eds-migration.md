# BanCoppel Homepage → AEM Edge Delivery Services Migration Plan

## 1. Overview

Migrate the BanCoppel homepage (`https://www.bancoppel.com/main/index.html`) — a Spanish-language retail banking marketing page — into this AEM Edge Delivery Services (EDS) project, reusing the standard AEM Block Collection wherever possible and adding a small number of styled block variants to match the brand.

The page is a classic marketing homepage: a hero carousel, several promotional card grids, a tabbed promotions area, an app-download section, an FAQ teaser, an SEO text block, and a rich footer. Nearly all of it maps cleanly onto standard EDS blocks.

## 2. Page Structure → Block Breakdown

| # | Section (source) | Content | Proposed EDS block |
|---|------------------|---------|--------------------|
| 1 | **Header / Navigation** | Logo, utility links (login, FAQ), main menu (Tarjetas de Crédito, Cuentas, Préstamos, Ahorro e Inversiones, Seguros, Envío de dinero, Servicios digitales), secondary links (Sucursales, Empresas, Hipotecario, Automotriz) | `header` (boilerplate nav) |
| 2 | **Hero Carousel** | 4 rotating slides — each: H2 + paragraph + CTA button + image | **Carousel** |
| 3 | **"BanCoppel: El banco que quiero"** | H1 + 5 quick-link promo tiles (Tarjeta, MSI, Préstamo Digital, Promociones, Inversión) | **Cards** (link-tile variant) |
| 4 | **"El banco que te acompaña…"** | App BanCoppel card (image + text + Descargar/Conocer CTAs) + Banca en línea card + disclaimer | **Columns** |
| 5 | **"BanCoppel te da posibilidades"** | 1 large feature card (Tarjeta de Crédito) + 3 smaller cards (Cuenta Efectiva, Inversiones, Seguros) | **Cards** (feature variant) |
| 6 | **"En BanCoppel eliges tú"** | Tabs (Promociones / Campañas); each panel shows promo cards (Chedraui, Tony, dportenis) + "Ir a Promociones" link | **Tabs** + **Cards** |
| 7 | **Security banner** | Icon/figure + "Nunca solicitamos datos personales…" + "Conocer tips" CTA | **Columns** (banner variant) |
| 8 | **"Resolvemos tus dudas" (FAQ)** | 3 Q&A cards + "Ir a Preguntas Frecuentes" link | **Cards** (Q&A variant) |
| 9 | **SEO link block** | 6 themed text paragraphs w/ inline links (Tarjetas, Cuentas, Préstamos, Inversiones, Seguros, Empresas) | **Columns** (default text content) |
| 10 | **Footer** | Logo, "Acerca de" links, Contacto, app-store badges, social icons, Grupo Coppel disclaimer, product-cost links, T&C, copyright | `footer` (boilerplate) |

### Block usage summary
- **Reused from the EDS Block Collection:** Carousel, Cards, Columns, Tabs.
- **From boilerplate:** Header (nav), Footer.
- **Likely new variants to author/style:** `cards (quick-links)`, `cards (feature)`, `cards (faq)`, `columns (banner)` — these are CSS-only variants over the base blocks, no new block types needed.
- **Not needed:** Table, Video, Accordion, Search, Embed (no matching content on this page). *Note: the FAQ teaser is static Q&A cards, not expandable — Cards is the right fit, not Accordion.*

## 3. Design Tokens (extracted from source)

### Fonts
| Role | Family | Notes |
|------|--------|-------|
| Body / UI | **Poppins** (Regular, Medium, SemiBold) | primary sans-serif, 16px base |
| Section headings (H2) | **Reckless Neue Medium** | serif display, ~36px |
| Page title (H1) | **Playfair Display** (Black/Medium) | serif display, navy |
| Legacy fallback | Helvetica Neue Bold, Open Sans | keep as fallback stack only |

> Migration note: Poppins and Playfair Display are on Google Fonts (self-host as `.woff2` for performance). Reckless Neue is a commercial licensed font — confirm we have the web-font license/files before self-hosting; otherwise substitute a comparable serif or fold H2 into Playfair Display.

### Color palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--brand-primary` | `#05297A` | primary deep blue (footer, buttons, headings) |
| `--brand-accent` | `#1C42E8` | bright blue (links, accents) |
| `--brand-navy` | `#081754` | H1 title color |
| `--text-color` | `#4A4A4A` | body text |
| `--background-color` | `#FFFFFF` | page background |
| `--light-blue` | `#D9E3F2` | soft blue surfaces |
| `--light-gray` | `#F3F3F3` | section backgrounds |
| `--border-gray` | `#DEDEDE` | dividers/borders |
| `--highlight-yellow` | `#FFEC99` | small highlight accents |

### Component style notes
- **Buttons:** pill shape (`border-radius: 24px`), Poppins-SemiBold, `12px 32px` padding. Primary = white text on `#05297A`; secondary = `#05297A` text on white.
- **Layout:** mobile-first, breakpoints at 600 / 900 / 1200px per project standards.

## 4. Migration Approach

This will run through the project's standard site-migration workflow: analyze page → confirm block mapping → generate import infrastructure (parsers/transformers) → run the bundled import script to produce content → apply design system → visually verify against the source. HTML content is never hand-written; it is produced by the import script.

## Checklist

### Phase 0 — Setup & confirmation
- [ ] Confirm scope: migrate the **homepage only** first (recommended), then expand to inner pages later
- [ ] Confirm Reckless Neue font licensing (self-host vs. substitute)
- [ ] Verify local dev server (`aem up` on `http://localhost:3000`) and preview are running

### Phase 1 — Analysis
- [ ] Run page analysis on the homepage to capture sections, content sequences, screenshots, and cleaned HTML
- [ ] Confirm the section→block mapping in the table above (sections 1–10)
- [ ] Identify which blocks are reused as-is vs. which need new CSS variants (quick-links, feature, faq cards; banner columns)

### Phase 2 — Design system
- [ ] Add font-face definitions for Poppins, Playfair Display, and Reckless Neue in `styles/fonts.css` (self-hosted `.woff2`, optimized)
- [ ] Set the color palette and typography as CSS custom properties in `styles/styles.css`
- [ ] Style base button (pill) and heading treatments to match the brand

### Phase 3 — Blocks
- [ ] Configure/style **Carousel** for the hero (4 slides: heading + text + CTA + image)
- [ ] Style **Cards** variants: quick-links (section 3), feature grid (section 5), FAQ (section 8)
- [ ] Configure **Tabs** + nested Cards for the promotions/campaigns section (section 6)
- [ ] Style **Columns** variants: app/banca section (4), security banner (7), SEO text block (9)
- [ ] Instrument the **header** nav (logo, main menu, utility + secondary links)
- [ ] Instrument the **footer** (links, contact, app badges, social, disclaimers)

### Phase 4 — Import infrastructure & content
- [ ] Generate block parsers and page transformers for the homepage template
- [ ] Generate and bundle the import script; run the bulk-import to produce the homepage content
- [ ] Download and optimize all source images (hero slides, promo logos, icons, app badges)

### Phase 5 — Verification
- [ ] Preview the imported page locally and compare section-by-section against the source
- [ ] Run visual critique to fix styling/spacing/color mismatches
- [ ] Check responsive behavior at 600 / 900 / 1200px breakpoints
- [ ] Run `npm run lint` (and `lint:fix`) — resolve all issues
- [ ] Verify accessibility (heading hierarchy, alt text, ARIA on nav/carousel/tabs)

### Phase 6 — Deploy
- [ ] Push to a feature branch; let AEM Code Sync build the feature preview
- [ ] Run PageSpeed Insights on the feature preview URL; target 100 and fix regressions
- [ ] Open a PR including the feature-preview link to the migrated homepage

---

> This artifact is a plan only. To begin executing (running analysis, generating infrastructure, importing content, and styling), switch to **Execute mode** and I'll proceed through the checklist starting with Phase 1.
>
> One decision worth settling up front — see the question below.

Since two choices materially change the work, let me confirm them before execution.Both decisions are settled. Here is the finalized plan reflecting your choices (homepage-only scope, Playfair Display for all serif headings).

# BanCoppel Homepage → AEM Edge Delivery Services Migration Plan

## 1. Overview

Migrate the BanCoppel homepage (`https://www.bancoppel.com/main/index.html`) — a Spanish-language retail banking marketing page — into this AEM Edge Delivery Services (EDS) project, reusing the standard AEM Block Collection wherever possible and adding a small number of CSS-only block variants to match the brand.

**Scope (confirmed):** Homepage only in this pass — this establishes the design system and reusable block patterns. Inner pages (Tarjetas, Cuentas, Préstamos, etc.) are a separate later effort.

The page is a classic marketing homepage: a hero carousel, promotional card grids, a tabbed promotions area, an app-download section, an FAQ teaser, an SEO text block, and a rich footer. Nearly all of it maps cleanly onto standard EDS blocks.

## 2. Page Structure → Block Breakdown

| # | Section (source) | Content | Proposed EDS block |
|---|------------------|---------|--------------------|
| 1 | **Header / Navigation** | Logo, utility links (login, FAQ), main menu (Tarjetas de Crédito, Cuentas, Préstamos, Ahorro e Inversiones, Seguros, Envío de dinero, Servicios digitales), secondary links (Sucursales, Empresas, Hipotecario, Automotriz) | `header` (boilerplate nav) |
| 2 | **Hero Carousel** | 4 rotating slides — each: H2 + paragraph + CTA button + image | **Carousel** |
| 3 | **"BanCoppel: El banco que quiero"** | H1 + 5 quick-link promo tiles (Tarjeta, MSI, Préstamo Digital, Promociones, Inversión) | **Cards** (link-tile variant) |
| 4 | **"El banco que te acompaña…"** | App BanCoppel card (image + text + Descargar/Conocer CTAs) + Banca en línea card + disclaimer | **Columns** |
| 5 | **"BanCoppel te da posibilidades"** | 1 large feature card (Tarjeta de Crédito) + 3 smaller cards (Cuenta Efectiva, Inversiones, Seguros) | **Cards** (feature variant) |
| 6 | **"En BanCoppel eliges tú"** | Tabs (Promociones / Campañas); each panel shows promo cards (Chedraui, Tony, dportenis) + "Ir a Promociones" link | **Tabs** + **Cards** |
| 7 | **Security banner** | Icon/figure + "Nunca solicitamos datos personales…" + "Conocer tips" CTA | **Columns** (banner variant) |
| 8 | **"Resolvemos tus dudas" (FAQ)** | 3 Q&A cards + "Ir a Preguntas Frecuentes" link | **Cards** (Q&A variant) |
| 9 | **SEO link block** | 6 themed text paragraphs w/ inline links (Tarjetas, Cuentas, Préstamos, Inversiones, Seguros, Empresas) | **Columns** (default text content) |
| 10 | **Footer** | Logo, "Acerca de" links, Contacto, app-store badges, social icons, Grupo Coppel disclaimer, product-cost links, T&C, copyright | `footer` (boilerplate) |

### Block usage summary
- **Reused from the EDS Block Collection:** Carousel, Cards, Columns, Tabs.
- **From boilerplate:** Header (nav), Footer.
- **New CSS-only variants to author/style:** `cards (quick-links)`, `cards (feature)`, `cards (faq)`, `columns (banner)` — variants over the base blocks, no new block types needed.
- **Not needed:** Table, Video, Accordion, Search, Embed (no matching content). *Note: the FAQ teaser is static Q&A cards, not expandable — Cards is the right fit, not Accordion.*

## 3. Design Tokens (extracted from source)

### Fonts (confirmed)
| Role | Family | Notes |
|------|--------|-------|
| Body / UI | **Poppins** (Regular, Medium, SemiBold) | primary sans-serif, 16px base |
| All serif display headings (H1 + H2) | **Playfair Display** | **substitutes Reckless Neue** — freely available, self-host as `.woff2` |
| Legacy fallback | Helvetica Neue, Open Sans | fallback stack only |

> Reckless Neue (commercial) is intentionally dropped; Playfair Display covers both the H1 title and the H2 section headings for a consistent serif treatment and no licensing risk.

### Color palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--brand-primary` | `#05297A` | primary deep blue (footer, buttons, headings) |
| `--brand-accent` | `#1C42E8` | bright blue (links, accents) |
| `--brand-navy` | `#081754` | H1 title color |
| `--text-color` | `#4A4A4A` | body text |
| `--background-color` | `#FFFFFF` | page background |
| `--light-blue` | `#D9E3F2` | soft blue surfaces |
| `--light-gray` | `#F3F3F3` | section backgrounds |
| `--border-gray` | `#DEDEDE` | dividers/borders |
| `--highlight-yellow` | `#FFEC99` | small highlight accents |

### Component style notes
- **Buttons:** pill shape (`border-radius: 24px`), Poppins-SemiBold, `12px 32px` padding. Primary = white text on `#05297A`; secondary = `#05297A` text on white.
- **Layout:** mobile-first, breakpoints at 600 / 900 / 1200px per project standards.

## 4. Migration Approach

Runs through the project's standard site-migration workflow: analyze page → confirm block mapping → generate import infrastructure (parsers/transformers) → run the bundled import script to produce content → apply design system → visually verify against the source. HTML content is never hand-written; it is produced by the import script.

## Checklist

### Phase 0 — Setup
- [ ] Verify local dev server (`aem up` on `http://localhost:3000`) and preview are running
- [x] Scope confirmed: **homepage only**
- [x] Heading font confirmed: **Playfair Display** substitutes Reckless Neue

### Phase 1 — Analysis
- [ ] Run page analysis on the homepage to capture sections, content sequences, screenshots, and cleaned HTML
- [ ] Confirm the section→block mapping in the table above (sections 1–10)
- [ ] Identify which blocks are reused as-is vs. which need new CSS variants (quick-links, feature, faq cards; banner columns)

### Phase 2 — Design system
- [ ] Add font-face definitions for Poppins and Playfair Display in `styles/fonts.css` (self-hosted `.woff2`, optimized)
- [ ] Set the color palette and typography as CSS custom properties in `styles/styles.css`
- [ ] Style base button (pill) and heading treatments to match the brand

### Phase 3 — Blocks
- [ ] Configure/style **Carousel** for the hero (4 slides: heading + text + CTA + image)
- [ ] Style **Cards** variants: quick-links (section 3), feature grid (section 5), FAQ (section 8)
- [ ] Configure **Tabs** + nested Cards for the promotions/campaigns section (section 6)
- [ ] Style **Columns** variants: app/banca section (4), security banner (7), SEO text block (9)
- [ ] Instrument the **header** nav (logo, main menu, utility + secondary links)
- [ ] Instrument the **footer** (links, contact, app badges, social, disclaimers)

### Phase 4 — Import infrastructure & content
- [ ] Generate block parsers and page transformers for the homepage template
- [ ] Generate and bundle the import script; run the bulk-import to produce the homepage content
- [ ] Download and optimize all source images (hero slides, promo logos, icons, app badges)

### Phase 5 — Verification
- [ ] Preview the imported page locally and compare section-by-section against the source
- [ ] Run visual critique to fix styling/spacing/color mismatches
- [ ] Check responsive behavior at 600 / 900 / 1200px breakpoints
- [ ] Run `npm run lint` (and `lint:fix`) — resolve all issues
- [ ] Verify accessibility (heading hierarchy, alt text, ARIA on nav/carousel/tabs)

### Phase 6 — Deploy
- [ ] Push to a feature branch; let AEM Code Sync build the feature preview
- [ ] Run PageSpeed Insights on the feature preview URL; target 100 and fix regressions
- [ ] Open a PR including the feature-preview link to the migrated homepage

---

> This is a plan artifact. **Execution requires Execute mode** — once you switch, I'll start with Phase 1 (homepage analysis) and work down the checklist.
