# Viewport Horizontal Overflow Manual Checklist

This checklist verifies that no horizontal scrolling occurs across all target viewports (mobile, tablet, and desktop) on `/products`.

## Console Verification Snippet

Open Developer Tools Console (F12) and run the following command across the specified viewport widths:

```js
console.log(document.documentElement.scrollWidth <= window.innerWidth);
```

The assertion must evaluate to **`true`** at each of the following viewport widths:

- [ ] **320px** (Small mobile / iPhone SE min width): `true`
- [ ] **375px** (Figma Phone/PLP canvas width): `true`
- [ ] **414px** (Large mobile / iPhone Plus / Max): `true`
- [ ] **768px** (Tablet portrait breakpoint boundary): `true`
- [ ] **1024px** (Tablet landscape / iPad Pro): `true`
- [ ] **1200px** (Desktop breakpoint boundary): `true`
- [ ] **1440px** (Figma Desktop canvas width): `true`
- [ ] **1920px** (Full HD widescreen desktop): `true`

---

## Interactive Dialog & Touch Target Checklist

- [ ] **Mobile Hamburger Menu (`<= 1199px`)**:
  - Touch target >= 44x44px (`min-width: 44px; min-height: 44px;`).
  - Opens `<dialog>` with focus trapped inside.
  - Body scroll locked (`overflow: hidden`) while open.
  - Pressing `Escape` or clicking close button closes the menu and returns focus to the hamburger trigger.
  - Clicking any of the 5 nav links navigates and closes the dialog.

- [ ] **Filter Drawer (`< 1200px`)**:
  - Opened via "FILTER" button on mobile & tablet.
  - Focus trapped inside `<dialog>`.
  - Body scroll locked while open.
  - Reuses the full `<FilterSidebar>` (category, price, rating).
  - Sticky bottom bar displays "Clear all" and dynamic "Show N results".
  - Pressing `Escape`, clicking backdrop, or clicking close button closes drawer and returns focus to the "FILTER" button.

- [ ] **Sort Options Bottom Sheet (`< 1200px`)**:
  - Opened via sort trigger on mobile & tablet.
  - Bottom sheet `<dialog>` displays all 5 options from `sort-options.ts`.
  - Selecting an option updates URL parameter, navigates, closes sheet, and returns focus to the trigger.
  - Active sort option highlighted in bold with a checkmark icon.

- [ ] **Sticky Toolbar**:
  - Height: exactly 41px on mobile (`<= 767px`), 88px on tablet & desktop (`>= 768px`).
  - Stays sticky on vertical scroll without causing layout jumping or horizontal overflow.
