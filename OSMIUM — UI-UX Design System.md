# OSMIUM — UI/UX DESIGN SYSTEM

## 1. Design Direction

OSMIUM should look like a **premium technology company that happens to sell products**, rather than a generic online store.

The visual identity should communicate:

> Precision. Density. Performance. Confidence.

Avoid:

- Generic gradients
- Excessive glassmorphism
- Excessive rounded cards
- Template-looking hero sections
- Random animations
- Oversized text everywhere
- Too many colors
- Excessive shadows
- Decorative UI without purpose

OSMIUM should feel engineered.

---

# 2. Brand

## Name

**OSMIUM**

Symbol:

**Os**

Optional brand mark:

```text
OS / OSMIUM
```

The visual identity can subtly reference the chemical element without turning the website into a science-themed interface.

---

# 3. Color System

## Primary Background

```text
Obsidian
#0B0F14
```

Used for:

- Main background
- Navigation
- Hero sections

## Surface

```text
Graphite
#111820
```

Used for:

- Cards
- Panels
- Dropdowns
- Modals

## Elevated Surface

```text
#17212B
```

Used for:

- Hover states
- Elevated panels
- Active UI

## Primary Accent

```text
Electric Cyan
#00E5FF
```

Used sparingly for:

- Primary CTAs
- Active navigation
- Focus states
- Important indicators
- Selected filters

## Text Primary

```text
#F4F7FA
```

## Text Secondary

```text
#A7B0BA
```

## Borders

```text
#26313C
```

## Success

```text
#35D07F
```

## Warning

```text
#FFB84D
```

## Error

```text
#FF5C6C
```

---

# 4. Color Principle

Electric Cyan should NOT dominate the interface.

The approximate visual ratio should be:

```text
Obsidian / Graphite     80%
White / Silver          15%
Electric Cyan            5%
```

The accent should feel valuable because it is scarce.

---

# 5. Typography

## Primary Font

**Space Grotesk**

Use for:

- Headlines
- Navigation
- Buttons
- Product names
- UI

Weights:

```text
400 Regular
500 Medium
600 Semibold
700 Bold
```

## Technical Font

**JetBrains Mono**

Use for:

- SKU
- Product codes
- Technical specifications
- Order IDs
- Admin analytics
- Small metadata

This creates a subtle engineering identity.

---

# 6. Typography Scale

```text
Display:
64px / 1.0

H1:
48px / 1.05

H2:
36px / 1.1

H3:
28px / 1.2

H4:
22px / 1.25

Body Large:
18px / 1.6

Body:
16px / 1.5

Body Small:
14px / 1.4

Caption:
12px / 1.3
```

Mobile should scale appropriately.

---

# 7. Logo

Primary wordmark:

```text
OSMIUM
```

Possible treatment:

```text
O S M I U M
```

with slightly increased letter spacing.

The logo should remain simple.

Do not create an overly complicated chemical-symbol logo.

---

# 8. Layout

Desktop maximum content width:

```text
1280px – 1440px
```

Main horizontal padding:

```text
24px
```

Large screens:

```text
32px – 48px
```

Mobile:

```text
16px
```

---

# 9. Border Radius

OSMIUM should use restrained rounding.

Suggested:

```text
Small:
6px

Medium:
10px

Large:
14px

Pills:
999px
```

Buttons should not all look like pills.

---

# 10. Shadows

Use shadows minimally.

Prefer:

```text
border
+
surface contrast
```

over huge shadows.

Dark interfaces should feel layered through tonal differences rather than excessive glow.

---

# 11. Navigation

Desktop:

```text
┌─────────────────────────────────────────────────────────┐
│ OSMIUM     Shop   Categories   New   Deals    Search  ◯ │
└─────────────────────────────────────────────────────────┘
```

Navigation should include:

- Logo
- Shop
- Categories
- New Arrivals
- Deals
- Search
- Account
- Cart

Cart should display an item count when non-zero.

---

# 12. Mobile Navigation

Mobile header:

```text
┌───────────────────────────────┐
│ ☰      OSMIUM          🛒     │
└───────────────────────────────┘
```

Navigation should become a drawer.

Do not simply shrink desktop navigation.

---

# 13. Homepage

## Hero

The hero should be visually strong but not generic.

Example structure:

```text
------------------------------------------------
PRECISION / CURATED COMMERCE

Products selected with intent.

Discover technology, essentials and
objects worth keeping.

[ SHOP COLLECTION ]

                         PRODUCT IMAGE
------------------------------------------------
```

Use large product photography.

Avoid stock-looking hero artwork.

---

# 14. Featured Products

Heading:

```text
FEATURED
```

Subheading:

```text
Selected products currently defining the OSMIUM catalog.
```

Grid:

Desktop:

```text
4 columns
```

Tablet:

```text
2–3 columns
```

Mobile:

```text
2 columns where appropriate
```

---

# 15. Product Card

Product cards should contain:

```text
┌───────────────────────────┐
│                           │
│       PRODUCT IMAGE       │
│                           │
│                  ♡        │
├───────────────────────────┤
│ CATEGORY                  │
│ Product Name              │
│ ★ 4.8                     │
│                           │
│ $129.00        + ADD      │
└───────────────────────────┘
```

The card should support:

- Hover image treatment
- Wishlist
- Quick add
- Product link
- Stock status

Avoid turning every card into a floating glass panel.

---

# 16. Product Listing Page

Layout:

```text
PRODUCTS

[ Search products........................ ]

FILTERS                    SORT BY
────────────────────────────────────────────

┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│      │ │      │ │      │ │      │
│      │ │      │ │      │ │      │
└──────┘ └──────┘ └──────┘ └──────┘
```

Desktop filters can appear as a sidebar.

Mobile filters should become a drawer.

---

# 17. Filters

Possible filters:

```text
Category
Price
Rating
Availability
Brand
Attributes
```

Filters must show active selections clearly.

Example:

```text
FILTERS

Category
□ Audio
□ Computing
□ Accessories

Price
$0 ───────────── $2,000

Rating
○ 4+
○ 3+
○ Any

[ CLEAR ALL ]
```

---

# 18. Search

Search should feel like a core product feature.

Desktop:

```text
⌕ Search products...
```

As the user types, provide suggestions.

Potential results:

```text
PRODUCTS
Sony WH-1000XM6
Sony WH-1000XM5

CATEGORIES
Headphones

RECENT
Wireless headphones
```

Do not make search suggestions visually overwhelming.

---

# 19. Product Details

Structure:

```text
Breadcrumb

┌─────────────────┐  ┌─────────────────────────────┐
│                 │  │ BRAND                       │
│                 │  │ PRODUCT NAME                │
│   IMAGE         │  │ ★★★★★ 4.8                  │
│                 │  │                             │
│                 │  │ DESCRIPTION                 │
│                 │  │                             │
│                 │  │ $299                        │
│                 │  │                             │
│                 │  │ [-] 1 [+]                   │
│                 │  │                             │
│                 │  │ [ ADD TO CART ]             │
│                 │  │                             │
│                 │  │ ✓ In stock                  │
└─────────────────┘  └─────────────────────────────┘
```

Below:

```text
Description
Specifications
Reviews
Shipping
Related Products
```

---

# 20. Image Gallery

Product gallery should support:

- Main image
- Thumbnail navigation
- Fullscreen view
- Keyboard navigation
- Mobile swipe

Use optimized images.

Do not load huge images unnecessarily.

---

# 21. Cart Drawer

Adding a product should optionally open a cart drawer.

Example:

```text
YOUR CART

────────────────────────────

PRODUCT

Wireless Headphones
$299 × 1

────────────────────────────

SUBTOTAL
$299

[ VIEW CART ]
[ CHECKOUT ]
```

Cart drawer must not trap users or become difficult to close.

---

# 22. Cart Page

Cart page:

```text
YOUR CART

ITEMS                           SUMMARY

Product                         Subtotal
Product                         Shipping
Product                         Total

                                [ CHECKOUT ]
```

Include:

- Quantity controls
- Remove
- Product image
- Price
- Availability
- Summary

---

# 23. Checkout UI

Checkout should be deliberately calm.

Steps:

```text
01 INFORMATION
02 SHIPPING
03 PAYMENT
```

Or use a simple single-page checkout.

Fields:

```text
Email
First name
Last name
Address
City
State
Postal code
Country
Phone
```

Summary remains visible on desktop.

---

# 24. Payment

The payment interface should clearly communicate:

```text
SECURE CHECKOUT

Your payment is securely processed by Paystack.
OSMIUM does not store your card details.

[ PAY $329.00 ]
```

Never create a fake payment form for production use if Paystack Inline Checkout is being used.

---

# 25. Order Success

Success page:

```text
✓ PAYMENT CONFIRMED

Order #OSM-20481

Thank you for your order.

Your order has been received and is being processed.

[ VIEW ORDER ]

[ CONTINUE SHOPPING ]
```

Do not depend only on client-side redirect data to declare payment successful.

---

# 26. Account Dashboard

Sidebar:

```text
ACCOUNT

Overview
Orders
Wishlist
Addresses
Settings
Logout
```

Main dashboard:

```text
WELCOME BACK

Recent order
Order #OSM-20481
Processing

[ VIEW ORDER ]
```

---

# 27. Orders

Order table:

```text
ORDER        DATE          TOTAL       STATUS

#OSM-20481   Sep 17        $329        Processing
#OSM-20402   Sep 12        $119        Delivered
```

Mobile should transform tables into cards.

---

# 28. Order Details

Display:

- Order number
- Date
- Products
- Quantities
- Pricing
- Address
- Payment status
- Fulfillment status
- Timeline

Timeline:

```text
✓ Order placed
│
✓ Payment confirmed
│
● Processing
│
○ Shipped
│
○ Delivered
```

---

# 29. Admin Dashboard

The admin interface should feel more analytical.

Example:

```text
OSMIUM / ADMIN

Overview

$42,840
Revenue

1,248
Orders

893
Customers

48
Low Stock
```

Then:

```text
Revenue
──────────────────────────────
        ╭────╮
    ╭───╯    ╰──╮
────╯           ╰────────────
```

Charts should prioritize clarity over decoration.

---

# 30. Admin Product Table

Columns:

```text
PRODUCT
SKU
CATEGORY
PRICE
STOCK
STATUS
ACTIONS
```

Actions:

```text
Edit
Archive
View
```

Destructive actions require confirmation.

---

# 31. Forms

Inputs should have:

- Label
- Input
- Optional description
- Validation
- Error message

Example:

```text
PRODUCT NAME

[ Sony WH-1000XM6 ]

Product name is required.
```

Never rely exclusively on placeholder text as labels.

---

# 32. Buttons

Primary:

```text
[ ADD TO CART ]
```

Secondary:

```text
[ VIEW DETAILS ]
```

Danger:

```text
[ DELETE PRODUCT ]
```

Buttons need:

- Hover
- Focus
- Active
- Disabled
- Loading

states.

---

# 33. Motion

Animations should be subtle.

Use animation for:

- Drawer opening
- Modal appearance
- Product image transitions
- Button feedback
- Page transitions where useful
- Skeleton loading

Avoid:

- Excessive parallax
- Constant movement
- Long animations
- Animations that delay functionality

Preferred duration:

```text
120–250ms
```

---

# 34. Accessibility

Keyboard users must be able to:

- Navigate menus
- Search
- Open products
- Use cart
- Complete checkout
- Close dialogs

Focus indicators must remain visible.

Do not remove browser focus styles without replacing them.

---

# 35. Responsive Breakpoints

Suggested:

```text
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

Use CSS/layout behavior rather than designing separately for every device.

---

# 36. Mobile Principles

Mobile is not a reduced desktop.

Prioritize:

1. Search
2. Product discovery
3. Product information
4. Cart
5. Checkout

Use bottom sheets/drawers for filters where appropriate.

---

# 37. Loading Skeletons

Product skeleton:

```text
┌──────────────────┐
│ ████████████████ │
│ ████████████████ │
│                  │
│ █████████        │
│ █████            │
│ ███████          │
└──────────────────┘
```

Skeletons should resemble the final content structure.

---

# 38. Empty States

Example:

```text
YOUR CART IS EMPTY

Nothing here yet.

Explore the catalog and find
something worth taking home.

[ EXPLORE PRODUCTS ]
```

---

# 39. Notifications

Use toast notifications for:

- Added to cart
- Removed from cart
- Profile updated
- Product saved

Avoid using toasts for information users need to study carefully.

---

# 40. Design Tokens

Example CSS variables:

```css
:root {
  --background: #0B0F14;
  --surface: #111820;
  --surface-elevated: #17212B;

  --accent: #00E5FF;

  --text-primary: #F4F7FA;
  --text-secondary: #A7B0BA;

  --border: #26313C;

  --success: #35D07F;
  --warning: #FFB84D;
  --error: #FF5C6C;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
}
```

---

# 41. Design Quality Rule

Every component should answer:

> Why does this element exist?

If removing a visual element improves clarity without reducing functionality, remove it.

OSMIUM should be visually impressive because of:

- Typography
- Spacing
- Photography
- Contrast
- Hierarchy
- Motion
- Consistency

not because of visual clutter.

---

# 42. Overall Visual Reference

The final experience should feel somewhere between:

```text
Premium technology
+
Modern editorial commerce
+
Engineering precision
```

but should not directly imitate any existing brand.

OSMIUM must have its own identity.