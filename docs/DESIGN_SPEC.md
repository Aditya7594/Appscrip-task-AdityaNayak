# DESIGN SPEC - Product Listing Page (PLP)
Source: Figma file "Design Task - PLP" (copy, file key fFwu64MFDgAo1bJV1fJA48). Frames: Web/PLP/With
Filter Expanded (node 653:1814), Web/PLP/With Filter (653:492), Web/PLP/Hidden Filter (653:3588),
Phone/PLP (653:3166). Desktop frames are 1440px wide, the phone frame is 375px wide.
There is NO tablet frame and NO loading / empty / error design. Those are [JUDGMENT] items: keep them
consistent with the design language.
Rule: every number below was read from Figma. Never invent design values. Anything marked [JUDGMENT] or
[DERIVED] was not stated explicitly in Figma.
## 1. Tokens
Colors: text #252020 | secondary-text #888792 | field-border #4D4D4D | tertiary-text #BFC8CD |
primary/accent #EB4C6B | tint-bg #FFF2F5 | icon #292D32 | white #FFFFFF | black #000000 | hairline #E5E5E5
(header bottom border; reuse for toolbar lines and separators).
Accessibility override [JUDGMENT]: #888792 on white is only 3.54:1 and #BFC8CD on white is 1.7:1. For any
real TEXT on white use #6B6A75 (5.33:1). Keep the original Figma colors for icons, borders and non-text
use. Mention this in the README.
Fonts: Simplon Norm (Regular, Medium, Bold) for all UI text; Adobe Caslon Pro Regular for the HIDE FILTER /
SHOW FILTER link; Inter ExtraBold (800) 36px for the LOGO wordmark. Simplon and Caslon are commercial
fonts: use free stand-ins loaded with next/font (Barlow for Simplon, Libre Caslon Text for Caslon, Inter
for LOGO) behind CSS variables --font-ui, --font-serif, --font-logo so they can be swapped.
Letter-spacing 1px on: nav links, LOGO, top strip text, hero title, language switch.
Shadow (sort menu only): 0 0 7px 1px rgba(163,170,175,0.2).
Container: 1248px wide with 96px side margins on a 1440 canvas (so max-width 1248px + padding-inline).
Type scale: hero title 60px Regular uppercase | hero text 22px/40px | nav 20px Bold | UI labels 18px Bold
uppercase | secondary labels 16px | card caption 14px | top strip 12px.
## 2. Desktop header (1440 canvas), total height 220 = 32 strip + 188 header
Top strip: height 32, black, three items evenly spaced (padding-inline 274, space-between). Each item =
16px icon + "Lorem ipsum dolor" 12px Regular, color #EB4C6B, letter-spacing 1px, gap 10.
Main header: height 188, white, border-bottom 1px #E5E5E5.- Brand mark SVG 36x36: left 96, top 40.- "LOGO" wordmark: horizontally centered, Inter ExtraBold 36px, black, letter-spacing 1px, vertically
centered at about y=58 inside the header.- Right icon cluster: right edge at 96, top 46. Search, heart, shopping bag, profile (24x24 each, gap 24),
then language "ENG" 16px Bold letter-spacing 1px + 16px chevron-down, gap 5.- Nav centered horizontally, top 140: SHOP, SKILLS, STORIES, ABOUT, CONTACT US. 20px Bold uppercase,
letter-spacing 1px, #252020, gap 64.
## 3. Hero (desktop)
Title "DISCOVER OUR PRODUCTS": 60px Regular, uppercase, letter-spacing 1px, centered, #252020, block
height 72, its top is 72px below the header bottom.
Intro paragraph: 22px Regular, line-height 40px, centered, width 721, #252020, starts 16px below the title
block.
Gap between paragraph bottom and toolbar top: 72.
## 4. Toolbar (desktop), 1248 wide, height 88, 1px hairline on top and bottom, white background
It is sticky (position: sticky; top: 0) in the Figma component.- Left: "3425 ITEMS" 18px Bold uppercase, line-height 40 (the number is dynamic: total from API). Next to
it, ~56px to the right: HIDE FILTER = 16px chevron-left icon + text, Caslon Regular 16px, underlined,
#888792, padding-inline 8, gap 8, line-height 40. When filters are hidden it reads SHOW FILTER.- Right: sort trigger = "RECOMMENDED" 18px Bold uppercase + 16px chevron-down, gap 8, right edge at 1344.- Sort menu (open): 235 wide x 324 tall, white, shadow token, anchored under the trigger (overlaps the
toolbar bottom line), right edge at 1344. Items 18px uppercase, line-height 40, vertical pitch about 58.
Order: RECOMMENDED (selected = Bold + 26px check icon to its left), NEWEST FIRST, POPULAR, PRICE : HIGH TO
LOW, PRICE : LOW TO HIGH. Unselected items are Regular weight.
## 5. Filter sidebar (desktop, filters visible)
Page 9
Appscrip PLP  |  AI Prompt Manual  |  Prepared for Aditya Nayak
Column x=96, width 300, starts 32px below the toolbar. Vertical gap 24 between blocks. 1px separator (300
wide) between groups.- Top row: checkbox 22x22 (white, border 0.917px #4D4D4D) + label "CUSTOMIZABLE" 18px Bold uppercase.- Group header: title 18px Bold uppercase (#252020) on the left + 16px chevron on the right, 8px below it a
line "All" (18px Regular) that summarizes the selection. Visible groups in order: IDEAL FOR (expanded in
Figma), OCCASION, WORK, FABRIC, SEGMENT, SUITABLE FOR, RAW MATERIALS, PATTERN (collapsed).- Expanded group body: "Unselect all" 16px Regular, underlined (#BFC8CD in Figma, see accessibility
override), then value rows with gap 24. Value row = checkbox 18x18 (white, border 0.75px #4D4D4D) + label
16px Regular, gap 8. Example values: Men, Women, Baby & Kids.- Checked checkbox look is not in Figma [JUDGMENT]: fill #252020 with a white check.
## 6. Product grid and card
With filter visible: sidebar 300 + gap 16, then a 3-column grid (3 x 300 + 2 x 16 = 932 wide). With filter
hidden: 4-column grid (4 x 300 + 3 x 16 = 1248). Column gap 16. Row pitch 494 = card 462 + row gap 32.
Card (300 wide, 462 tall): image 300x399 (aspect ratio 3:4, object-fit cover, light photographic
backgrounds). 16px below the image: text block 300x47.- Title: 18px Bold uppercase, #252020, single line with ellipsis (height 22).- Heart icon 24x24 at the right edge of the text block (outline). A wishlisted card shows the heart filled
with #EB4C6B.- Caption line 8px below the title: 14px Regular #888792: "Sign in" (underlined) + " or Create an account
to see pricing". See the price decision in the manual.
Hover / focus-visible states are not in Figma [JUDGMENT]: keep subtle (focus ring 2px #252020 offset 2px;
image opacity 0.92 on hover).
## 7. Desktop footer (1440 x 750, black, content padding-left 128, content width 1248)
Three columns at x=128, x=504, x=888.- Column 1 top: "BE THE FIRST TO KNOW" 20px Bold uppercase white; text "Sign up for updates from mettā
muse." 16px; newsletter row 584 x 48: white input (padding 14px 24px, placeholder "Enter your e-mail..."
18px) + SUBSCRIBE button 184 x 48 (black, 1.143px white border, radius 5, uppercase 18px Medium, rendered
at opacity 0.3).- Column 3 top: "CONTACT US" 20px Bold uppercase; "+44 221 133 5360" and "customercare@mettamuse.com" 16px;
then "CURRENCY" 20px Bold uppercase; row = 24px US flag circle + 6px dot + "USD" 16px Bold letter-spacing
1px; note 12px, width 447: "Transactions will be completed in Euros and a currency reference is available
on hover."- Divider: 1px line, 1248 wide, white-ish [JUDGMENT: rgba(255,255,255,0.3)].- Bottom row: column 1 = "mettā muse" brand text 24.7px Bold + list About Us, Stories, Artisans, Boutiques,
Contact Us, EU Compliances Docs (18px Regular, gap 16). Column 2 = "QUICK LINKS" 20px Bold uppercase +
Orders & Shipping, Join/Login as a Seller, Payment & Pricing, Return & Refunds, FAQs, Privacy Policy, Terms
& Conditions. Column 3 = "FOLLOW US" + Instagram and LinkedIn icons (32px circles, 1.2px white border, gap
12), then "mettā muse ACCEPTS" 20px Bold + six payment badges (56x35, white, radius 5, gap 8): GPay,
Mastercard, PayPal, Amex, Apple Pay, one purple wallet badge.- Copyright centered, 14px: "Copyright © 2023 mettamuse. All rights reserved."
## 8. Phone (375 canvas)- Top strip: height 24, black, one item "Lorem ipsum dolor" 12px #EB4C6B centered.- Header: height 55, white. Hamburger 20px at x=16; brand mark 20px at x=44; "LOGO" centered (about 24px
high wordmark [DERIVED]); icons on the right (search, heart, bag, 20px, gap 12) with 16px right padding.- Breadcrumb row: height 46, padding-inline 16, 12px uppercase [DERIVED]: HOME (#BFC8CD) | SHOP (#252020),
separators "|".- Hero: title 24px Regular uppercase centered [DERIVED], paragraph 16px/22px centered [DERIVED], width
343.- Filter bar: height 41, hairlines top and bottom, vertical divider in the middle (height 25). Left cell
"FILTER", right cell "RECOMMENDED" + chevron, both 14px Bold uppercase.- Grid: padding-inline 16 (content 343/344), 2 columns of 168, column gap 8, row gap 16. Image 168 x 224
(3:4). Text block about 45 tall: title 14px Bold uppercase ellipsis, heart 20px on the right, caption 12px
#888792 that wraps onto 2 lines.- Footer (black, padding 16), order: BE THE FIRST TO KNOW (16px Bold) + 14px text; subscribe row (input 226
x 47 + button 109 x 48, gap 8); hairline; CALL US + phone and email on one row; hairline; CURRENCY + flag +
USD; then three accordion rows with chevron-down and hairline separators: "mettā muse", QUICK LINKS,
FOLLOW US; then "mettā muse ACCEPTS" + badges; copyright 12px centered.
## 9. Tablet (768-1199) [JUDGMENT, no Figma frame]
Side padding 32. Header keeps the desktop structure with smaller nav (16px, gap 32). Filters become an
off-canvas drawer opened by a FILTER button (the sidebar does not fit). Grid is 3 columns with gap 16.
Footer keeps 3 columns.
## 10. States [JUDGMENT, not in Figma]
Loading = skeleton cards with the exact card geometry. Empty = centered message "No products match your
filters." + "Clear all filters" link. Error = centered message + "Try again" button. Use the same
typography and colors as above.
