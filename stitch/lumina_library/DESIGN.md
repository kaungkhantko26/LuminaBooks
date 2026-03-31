# Design System Strategy: The Luminous Archive

## 1. Overview & Creative North Star
The **Creative North Star** for this design system is **"The Digital Curator."** 

Unlike traditional libraries that feel dense, wooden, or purely functional, this system treats information as a high-end gallery experience. We move away from the "grid-of-boxes" mentality and toward a fluid, editorial layout. We break the template look by using **intentional asymmetry**: large-scale typography paired with generous, "breathing" white space (using our 20 and 24 spacing tokens) and overlapping glassmorphism elements that suggest depth without density. The goal is a digital environment that feels **Soft, Clean, and Calm**, yet undeniably **Premium**.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a sophisticated transition from soft purples to pastel pinks, grounded by a cool-toned neutral foundation.

### The Color Logic
- **Primary (`#6b38d4`)**: Used for high-intent actions and brand anchors.
- **Secondary (`#a43073`)**: Reserved for celebratory moments, badges, and soft highlights.
- **Tertiary (`#006387`)**: Our Sky Blue accent, used sparingly for informational cues or "New" indicators to maintain a calm temperature.
- **Surface Tiers**: Use `surface_container_lowest` (#ffffff) for active cards and `surface` (#f7f9ff) for the main canvas.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts or tonal transitions. To separate a sidebar from a main feed, transition from `surface` to `surface_container_low`. If an element needs to stand out, let its elevation and color change do the work, not a stroke.

### The "Glass & Gradient" Rule
To elevate the UI beyond a standard flat kit:
- **Glassmorphism:** Floating navigation bars and modal overlays must use `surface_container_lowest` at 70% opacity with a `blur-xl` (20px-40px) effect.
- **Signature Textures:** Use the Brand Identity Gradient (`linear-gradient(135deg, #8B5CF6, #F472B6)`) for primary CTAs and Hero section accents. This "visual soul" prevents the system from feeling sterile.

---

## 3. Typography
We utilize a dual-font system to balance editorial authority with modern readability.

*   **Display & Headlines (Plus Jakarta Sans):** These are the "voice" of the library. Use `display-lg` (3.5rem) with tight letter-spacing for high-end editorial impact. Large headlines should often be left-aligned with significant padding-top (Spacing 16+) to create an "asymmetric anchor" for the page.
*   **Body & Labels (Manrope):** Chosen for its geometric clarity. `body-lg` (1rem) is the standard for book descriptions to ensure the "Calm" keyword is met through legibility.
*   **Hierarchy as Identity:** Use `headline-sm` in `secondary_fixed_variant` for category labels to add a sophisticated pop of color against the neutral background.

---

## 4. Elevation & Depth
In this design system, depth is a feeling, not a structure.

### The Layering Principle
Stack tiers to create natural lift. Place a `surface_container_lowest` card on a `surface_container_low` background. The subtle shift in hex value creates a "soft lift" that feels more premium than a heavy shadow.

### Ambient Shadows & Ghost Borders
*   **Shadows:** When an element must "float" (e.g., a hovered book cover), use an extra-diffused shadow: `0 20px 40px -12px rgba(18, 29, 38, 0.08)`. The tint is derived from our `on_surface` color, never pure black.
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use the `outline_variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Uses the Brand Gradient. Roundedness: `full`. No border. Transition: `0.3s ease-in-out`.
*   **Secondary:** `surface_container_highest` background with `primary` text. This creates a soft, integrated look.
*   **Tertiary:** Ghost style. No background, `primary` text, transitions to a 5% `primary` background on hover.

### Cards & Lists
*   **Rule:** Forbid divider lines.
*   **Execution:** Use Spacing 6 (2rem) between list items. For cards, use `rounded-xl` (3rem) for a friendly, approachable aesthetic.
*   **Interaction:** On hover, a card should shift from `surface_container_lowest` to a subtle `surface_container_high` with a gentle `0.2s` lift.

### Input Fields
*   **Style:** `surface_container_low` background. No visible border in the default state.
*   **Focus:** Transitions to a `ghost-border` of `primary` at 40% opacity with a soft outer glow.
*   **Corners:** `rounded-md` (1.5rem).

### Specialized Library Components
*   **The "Reading Progress" Bar:** A 4px slim track using `surface_container_highest` with a `primary` fill.
*   **Immersive Book Covers:** Book covers should not have borders. Use a `1px` inner-glow (white at 10% opacity) to make them pop against dark backgrounds.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use white space as a structural element. If a layout feels crowded, increase spacing to token 12 or 16.
*   **Do** use the `secondary_container` color for "Saved" or "Bookmarked" states to provide a warm, friendly feedback loop.
*   **Do** ensure all Glassmorphism elements have a high enough backdrop-blur to maintain text contrast (WCAG 2.1 compliance).

### Don’t:
*   **Don’t** use pure black (#000000) for text. Always use `on_surface` (#121d26) to maintain the "Soft" brand keyword.
*   **Don’t** use sharp corners. Every interactive element must use at least the `DEFAULT` (1rem) roundedness scale.
*   **Don’t** stack more than three layers of surfaces. It breaks the "Clean" aesthetic and creates visual "mud."