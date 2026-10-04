# Design QA Audit

This document records the visual quality assurance and design fidelity audit comparing the implemented Product Listing Page (PLP) at desktop (1440px) and mobile (375px) viewports against the source Figma design file **"Design Task - PLP"** (key `fFwu64MFDgAo1bJV1fJA48`), specifically nodes:
- **`653:1814`**: Web/PLP/With Filter Expanded (1440px desktop canvas with 3-column grid and open sidebar)
- **`653:3588`**: Web/PLP/Hidden Filter (1440px desktop canvas with 4-column grid and collapsed sidebar)
- **`653:3166`**: Phone/PLP (375px mobile canvas with 2-column grid and mobile filter bar)

---

## 1. Design Comparison Matrix

| Area | Figma Node ID | What to Compare | Result | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **Header** | `653:1814` | Height 220px (32px black top strip + 188px main header). 3 top strip items (#EB4C6B, 12px, gap 10px). Brand mark SVG (36x36px at x=96px), "LOGO" wordmark centered (Inter 800, 36px, letter-spacing 1px), right cluster (search, heart, bag, profile 24px + ENG 16px Bold + chevron), centered nav (SHOP, SKILLS, STORIES, ABOUT, CONTACT US in 20px Bold, gap 64px). Hairline border-bottom #E5E5E5. | **PASS** | Exact geometry, positions, and typography match. Barlow and Inter used behind CSS variables as authorized stand-ins for proprietary fonts. |
| **Hero** | `653:1814` | Centered uppercase title "DISCOVER OUR PRODUCTS" (60px, #252020, letter-spacing 1px), 72px gap below header bottom. Centered intro paragraph max-width 721px (22px/40px, #252020), 16px below title block. 72px gap between paragraph bottom and toolbar top. | **PASS** | Exact line-height (40px), max-width (721px), and vertical spacing rhythm (72px / 16px / 72px) preserved. |
| **Toolbar** | `653:1814` | Height 88px, 1248px content width, 1px hairlines on top and bottom (#E5E5E5). Left: dynamic total count "XX ITEMS" (18px Bold uppercase), next to it HIDE FILTER / SHOW FILTER (16px chevron + Caslon serif font, underlined, #888792). Right: sort trigger "RECOMMENDED" (18px Bold uppercase) + 16px chevron-down. | **PASS** | Dynamic count reflects active catalog query. Toggle updates chevron direction and switches label between "HIDE FILTER" and "SHOW FILTER". |
| **Sort Menu** | `653:1814` | Floating menu 235x324px, white background, shadow `0 0 7px 1px rgba(163,170,175,0.2)`. Anchored below trigger, right-aligned at 1344px. 5 options: RECOMMENDED (selected with bold weight + 26px checkmark icon on left), NEWEST FIRST, POPULAR, PRICE : HIGH TO LOW, PRICE : LOW TO HIGH. Unselected regular weight. | **PASS** | Menu options, checkmark positioning, active state styling, and full keyboard navigation (arrows, Enter, Escape) implemented. |
| **Filters** | `653:1814` | Column width 300px, 24px vertical gap between filter groups, 1px separators (#E5E5E5). Group headers: 18px Bold uppercase title with 16px chevron on right, 8px below an "All" summary line (18px Regular). Value rows: 18x18px custom checkboxes with 16px Regular labels. Expanded group has "Unselect all" link. | **PASS** | Faithfully mirrors Figma layout rhythm. Per spec Decision D2, real database facets (CATEGORY, PRICE, RATING) populate the groups. Accessible contrast enhanced to #6B6A75. |
| **Card** | `653:1814`, `653:3588` | Card size 300x462px. Image 300x399px (aspect ratio 3:4, object-fit cover). 16px gap between image and text block. Title: 18px Bold uppercase with single-line ellipsis. Heart icon 24x24px aligned to top right of text area. Caption 14px Regular #888792: "Sign in or Create an account to see pricing". Price displayed below title. | **PASS** | Next.js Image component enforces strict aspect ratio with zero layout shift (CLS 0.000). Active wishlist heart fills with accent #EB4C6B. |
| **Grid 3-col** | `653:1814` | Default desktop with filters open: 300px sidebar + 16px gap + 3 columns of 300px with 16px column gap (932px width) = 1248px content area. Row pitch 494px (462px card + 32px row gap). | **PASS** | Computed style confirms `grid-template-columns: repeat(3, minmax(0, 1fr))` on `.productGrid`. |
| **Grid 4-col** | `653:3588` | When filters are hidden: sidebar collapsed (display: none), grid expands to 4 columns of 300px with 16px column gap (1248px width). Row gap 32px. | **PASS** | Computed style confirms `grid-template-columns: repeat(4, minmax(0, 1fr))` when `data-filters="hidden"`. |
| **Footer Desktop** | `653:1814` | Black background, 1440px wide, content width 1248px with 96px side padding. 3 columns: (1) "BE THE FIRST TO KNOW" + newsletter input (white) + SUBSCRIBE button (black with white border); (3) CONTACT US (+44 phone, email) + CURRENCY (US flag circle + USD). White hairline divider. Bottom row: brand text, QUICK LINKS, FOLLOW US (Instagram, LinkedIn icons in 32px circles), 6 payment badges (GPay, Mastercard, PayPal, Amex, Apple Pay, Shop Pay), centered copyright. | **PASS** | All columns, iconography, payment badge SVGs, and responsive alignments match Figma specifications. |
| **Mobile Header** | `653:3166` | 375px canvas, height 55px, white background. Top strip 24px height with centered "Lorem ipsum dolor" in #EB4C6B. Header row: 20px hamburger at x=16px, 20px brand mark at x=44px, centered "LOGO" wordmark (24px), right icon cluster (search, heart, bag 20px, gap 12px) with 16px right margin. Breadcrumb row (HOME > SHOP) below header. | **PASS** | Exact dimensions, alignments, and icon sizes match. Hamburger opens accessible slide-over dialog menu with native focus trapping. |
| **Mobile Filter Bar** | `653:3166` | Height 41px, hairlines top and bottom, vertical divider in middle (height 25px). Left cell "FILTER" (14px Bold uppercase), right cell "RECOMMENDED" (14px Bold uppercase) + chevron-down. | **PASS** | Left cell opens modal filter drawer; right cell toggles mobile sort options menu. |
| **Mobile Grid** | `653:3166` | 375px viewport with 16px side padding (content 343px). 2-column grid of 168px cards, column gap 8px, row gap 16px. Image 168x224px (3:4 ratio). Text block ~45px tall: title 14px Bold uppercase with ellipsis, heart 20px on right, 12px caption wrapping cleanly. | **PASS** | Verified via Playwright: computed style is 2 columns, and `scrollWidth <= innerWidth` passes across 320px, 375px, and 414px viewports. |
| **Mobile Footer** | `653:3166` | Black background, 16px side padding. Vertically stacked order: BE THE FIRST TO KNOW (16px Bold) + 14px text, subscribe row (input + button), hairline, CALL US + phone/email, hairline, CURRENCY + flag + USD, three accordions with chevron-down and separators ("mettā muse", QUICK LINKS, FOLLOW US), payment badges, centered 12px copyright. | **PASS** | Accordions toggle smoothly with accessible `aria-expanded` and `aria-controls`. |

---

## 2. Visual Differences & Intentional Design Decisions

1. **Typography Stand-ins**:
   - Proprietary fonts *Simplon Norm* and *Adobe Caslon Pro* from the Figma design were replaced with free open-source fonts (*Barlow* and *Libre Caslon Text*) via `next/font/google`, mapped to CSS variables `--font-ui` and `--font-serif` per Design Spec Section 1. *Inter* (weight 800) is used for the "LOGO" wordmark (`--font-logo`).

2. **Accessibility Color Contrast**:
   - Secondary text color in Figma is `#888792` on white (contrast ratio 3.54:1) and tertiary text is `#BFC8CD` on white (1.7:1), both failing WCAG AA (minimum 4.5:1).
   - In accordance with the project accessibility override rule, body text elements on white backgrounds utilize `#6B6A75` (5.33:1), exceeding WCAG AA standards while maintaining the Figma gray visual aesthetic. Figma's original `#888792` and `#BFC8CD` are strictly retained for borders, decorative icons, and inactive states.

3. **Dynamic Data Integration**:
   - The desktop filter sidebar and mobile filter drawer display real categories (`Electronics`, `Jewelery`, `Men's Clothing`, `Women's Clothing`), price ranges, and minimum rating filters seeded from the database, rather than static mock apparel facets (*IDEAL FOR*, *OCCASION*, *FABRIC*) from the mockup canvas (as specified by architectural decision D2).

4. **Product Card Pricing**:
   - In addition to the Figma caption *"Sign in or Create an account to see pricing"*, the product card displays formatted real prices (e.g. `$55.99`) above the caption to satisfy e-commerce functionality and API data binding requirements.
