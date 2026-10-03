import pypandoc
from pathlib import Path

content = """KEPLEX SHOPPING — STOREFRONT UI/UX REDESIGN NOTES
======================================================

Purpose
-------
This document tracks the storefront product-related UI/UX redesign as we proceed.
It is intended to preserve design decisions, completed work, component behavior,
and follow-up items so the work can continue consistently across sessions.

Current Design Direction
------------------------
- White-first ecommerce interface.
- Near-black structure and primary text.
- Restrained wine/burgundy brand identity.
- Products remain the visual focus.
- Avoid unnecessary cards, nested boxes, and large gray containers.
- Use whitespace, alignment, dividers, and background changes before adding containers.
- Motion should communicate hierarchy, state, continuity, feedback, or loading.
- Avoid decorative animation.

Brand / Design Tokens
---------------------
Primary:
- background: #ffffff
- foreground: #111111
- brand: #7a1f3d
- brand-hover: #64182f
- brand-foreground: #ffffff
- brand-soft: #f7eef1

Surfaces:
- surface: #f7f7f7
- surface-elevated: #ffffff
- surface-dark: #111111

Borders:
- border: #e5e5e5
- border-strong: #d4d4d4

Text:
- text-primary: #111111
- text-secondary: #525252
- text-muted: #737373
- text-disabled: #a3a3a3

Semantic:
- success: #15803d
- warning: #b45309
- error: #b91c1c
- info: #2563eb

Typography
----------
- Inter / system sans stack.
- 400: descriptions and supporting text.
- 500: navigation, product names, labels.
- 600: prices, important headings, primary actions.
- 700: major headings only.
- Restrained type scale.
- Product/listing sections generally use py-12 md:py-16 lg:py-20.

Radius
------
- Buttons and inputs: approximately 8px.
- Product images: approximately 12px.
- Pills: full radius.
- Cards only when they serve a clear structural purpose.

Elevation
---------
Preferred order:
1. No shadow.
2. Border.
3. Subtle surface/background change.
4. Shadow only where elevation is genuinely needed.

Motion System
-------------
- Color/state transitions: transition-colors duration-200.
- Product image hover: subtle scale, e.g. scale-[1.03].
- Main product gallery image: subtle scale, e.g. scale-[1.02].
- Gallery controls can use opacity transitions.
- Loading skeletons use animate-pulse.
- Loading indicators use animate-spin.
- Do not use blanket hover:scale on buttons.
- Focus states use the brand color.
- Motion should not be added merely for decoration.

PRODUCT LISTING — COMPLETED
===========================

ProductCard
-----------
Completed redesign:
- Removed outer card/background/border treatment.
- Product image is the visual anchor.
- Image uses rounded-xl.
- Product image hover uses subtle scale-[1.03].
- Wishlist uses wine brand color instead of red.
- Product name changes to brand color on hover.
- Existing wishlist logic and optimistic state preserved.
- Existing authentication redirect preserved.
- Existing price/compare-at-price logic preserved.
- Existing brand, reviews, variants, and colors preserved.
- Existing StorefrontCard data shape preserved.
- Badges remain restrained:
  - New: white/soft treatment.
  - Bestseller: near-black/white treatment.

ProductEmptyState
-----------------
Completed:
- Removed unnecessary visual container.
- Centered simple message.
- Uses primary heading plus muted supporting description.

ProductGridSkeleton
--------------------
Completed:
- Matches the new product grid.
- Product image placeholder uses surface background and rounded-xl.
- Text placeholders use restrained spacing.
- Keeps animate-pulse for loading feedback.

ProductGrid
-----------
No behavior changes.
- Existing authentication lookup preserved.
- Existing batch wishlist check preserved.
- Existing ProductCard mapping preserved.
- Grid remains:
  - 2 columns mobile.
  - 3 columns medium.
  - 4 columns large.
- Spacing adjusted to match the new visual system.

ProductListingHeader
--------------------
Completed:
- Larger, cleaner heading hierarchy.
- Restrained typography.
- Maximum text width to prevent overly long lines.
- Uses design tokens.
- Increased vertical breathing room.

ProductSort
-----------
Completed:
- Existing sort options preserved.
- Existing ProductSortValue preserved.
- Styled as a restrained select control.
- Uses border/surface tokens.
- Brand-aware focus state.
- Color transitions only; no decorative movement.

ProductToolbar
--------------
IMPORTANT: Existing API/logic is preserved.

Existing props:
- resultCount
- state
- onSortChange
- onFiltersOpen
- onClearFilters
- showFilterButton

Do NOT replace this API with a new `total/sort` API merely for styling.

Completed visual changes:
- Tokenized borders and text.
- Filter button uses rounded-lg instead of a pill.
- Filter button uses white surface with subtle border.
- Hover state uses surface/brand.
- Focus ring uses brand.
- Sort remains connected to state.sort.
- Existing filter detection logic preserved.
- Existing Clear Filters behavior preserved.
- Clear Filters uses brand-aware hover state.
- Mobile filter button remains available only on lg:hidden.

ProductsPage
------------
The page was updated to use the existing ProductToolbar contract.

Important structure:
- ProductListingHeader
- ProductToolbar
- ProductGridSkeleton / error / ProductGrid / ProductEmptyState
- ProductInfiniteLoader

The ProductPage should continue using:
    const { state, params, setSort, clearFilters } = useProductDiscovery();

Toolbar should use:
    <ProductToolbar
      resultCount={totalCount}
      state={state}
      onSortChange={setSort}
      onFiltersOpen={() => {
        // Mobile filters will be wired here.
      }}
      onClearFilters={hasFilters ? clearFilters : undefined}
      showFilterButton
    />

Do not introduce a second filtering state system.

Product Listing State Utility
-----------------------------
Existing utility was reviewed and does not require visual redesign.

Supported state:
- search
- categoryId
- brandId
- collectionId
- isFeatured
- isNew
- isBestSeller
- minPrice
- maxPrice
- sort

Supported sort values:
- recommended
- newest
- name-asc
- name-desc

URL synchronization and API parameter mapping are existing behavior and
should remain intact unless a functional bug is found.

PRODUCT PAGE — COMPLETED REDESIGN
=================================

Structure
---------
The Product Page follows:

1. Breadcrumb
2. Gallery + purchase information
3. Product Details
4. Reviews
5. Related Products

Completed changes:
- Main product image changed to rounded-xl.
- Thumbnail images use rounded-lg.
- Gallery hover controls remain available without permanently cluttering the image.
- Main image uses subtle scale transition.
- Product badges standardized to New and Bestseller.
- New uses brand-soft/wine treatment.
- Bestseller uses near-black treatment.
- Product price remains near-black and visually strong.
- Discount treatment uses wine-soft styling.
- Color and size selected states use wine background + white text.
- Unselected variant controls use white/border styling.
- Add to Cart is the primary wine CTA.
- Quantity controls remain neutral.
- Availability uses semantic success/error colors.
- Shipping section no longer uses an unnecessary nested gray box.
- Shipping information is presented with simple icon/text hierarchy.
- Product details use simple attribute rows rather than multiple mini-cards.
- Related products reuse ProductGrid.
- Duplicate product description in the purchase area was removed.
- Full description remains in Product Details.
- Existing product data, variant selection, gallery, quantity, cart mutation,
  authentication redirect, and related-product behavior are preserved.

Product Page interaction states:
- Buttons: color transitions.
- Variant selection: color transitions.
- Gallery image: subtle transform.
- Gallery controls: opacity transitions.
- Focus rings: brand.
- Disabled states: muted.
- No decorative button scaling.

Button Component
----------------
The original Button component had a bug:
- `rounded` was being passed directly as a class instead of mapping values
  such as `md` to `rounded-lg`.

The redesigned Button maps:
- none -> rounded-none
- sm -> rounded-sm
- md -> rounded-lg
- full -> rounded-full

Button variants now use the design tokens:
- primary: wine brand
- secondary: surface
- outline: white + border
- ghost: transparent with surface/brand interaction

Button sizes remain:
- sm
- md
- lg
- icon

Button motion remains limited to color/state transitions.
No hover scaling was added.

IMPORTANT BUTTON NOTE
---------------------
The Button interface currently declares `as?: ElementType`, but the component
does not actually implement polymorphic rendering.

Therefore:
- Do NOT use <Button as={Link}> yet.
- Use a normal React Router Link styled like a button when navigation is needed.
- Only implement true polymorphic Button behavior if it becomes an actual
  requirement.

CURRENT MOBILE FILTER STATUS
============================

Not built yet.

The existing ProductToolbar already exposes:
- onFiltersOpen
- showFilterButton

The mobile filter should eventually provide a mobile interface for the
existing ProductListingState.

Existing filters:
- Category
- Brand
- Collection
- Featured
- New
- Bestseller
- Minimum price
- Maximum price

Design direction:
- Prefer a mobile drawer/bottom sheet rather than an inline boxed filter panel.
- Reuse the existing discovery state.
- Do not create a second filtering system.
- Apply/Clear behavior should connect to the existing state/update logic.
- Do not build this until the current product listing render has been visually
  tested and reviewed.

CURRENT TESTING STATUS
======================

The current product listing and product page redesign should now be rendered
and visually checked before moving to unrelated storefront components.

Review specifically:
- Desktop spacing and hierarchy.
- Mobile 2-column product grid.
- Toolbar fit at narrow widths.
- Sort control at mobile widths.
- Product image proportions.
- Product title/price spacing.
- Product page gallery proportions.
- Variant controls.
- Add-to-cart hierarchy.
- Shipping/detail density.
- Loading and empty states.
- Error state.
- Infinite loading/end state.

When a visual issue is found:
- Preserve existing data shapes and behavior.
- Fix the specific component.
- Prefer full paste-ready files.
- Avoid redesigning unrelated components.
- Record the change in this document before moving to the next component.

DESIGN RULES TO CONTINUE
========================

1. Do not add containers/cards unless they solve a real hierarchy problem.
2. Products should remain the visual focus.
3. Wine should be selective, not dominant.
4. Near-black remains the structural anchor.
5. Use spacing before borders.
6. Use borders before shadows.
7. Use shadows only where elevation is meaningful.
8. Use motion only when it communicates something.
9. Preserve existing application logic during visual redesign.
10. Do not invent fields or change API/data contracts for styling purposes.
11. Keep responsive behavior intentional.
12. Validate rendered UI before moving to the next major component.

NEXT STEP
=========

1. Render/test the current Product Listing and Product Page.
2. Review screenshots or visible output.
3. Fix any concrete visual issues found.
4. Then build the mobile filter drawer using the existing filtering state.
5. Continue documenting each completed component/change here.
"""

output_path = "/mnt/data/keplex-storefront-ui-ux-notes.txt"
pypandoc.convert_text(
    content,
    "plain",
    format="md",
    outputfile=output_path,
    extra_args=["--standalone"],
)

print(output_path)
