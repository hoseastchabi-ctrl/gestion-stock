---
name: Kinetic Inventory
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45474c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#041528'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a2a3e'
  on-tertiary-container: '#8191a9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  stats-numeric:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 24px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  touch-target: 48px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is engineered for high-stakes operational environments where speed and accuracy are paramount. The brand personality is rooted in **Professionalism, Stability, and Precision**, catering to warehouse managers and logistics agents who require a tool that feels like a high-performance utility rather than a consumer app.

The visual style is **Corporate Modern with a Functional Edge**. It prioritizes clarity through a structured flat UI, utilizing high-contrast elements to ensure legibility under various lighting conditions (from bright warehouses to low-light loading docks). The interface employs a systematic approach to density, providing large touch targets for mobile accessibility while maintaining the information density required for desktop inventory auditing.

**Key Principles:**
- **Utility First:** Every pixel serves a functional purpose; decorative elements are stripped away.
- **Immediate Feedback:** Color and shape are used as cognitive shortcuts to communicate stock status.
- **Tactile Reliability:** Components utilize subtle depth to indicate interactivity without sacrificing the clean, professional aesthetic.

## Colors

The palette is anchored by **Deep Indigo** (`#1E293B`) to establish a sense of authority and trust. This primary color is used for navigation, headers, and core structural elements. 

**Functional Color Mapping:**
- **Success Green:** Reserved exclusively for positive stock movements (Stock In) and "In Stock" status indicators.
- **Danger Red:** Used for critical "Out of Stock" alerts and destructive actions.
- **Warning Orange:** Applied to "Low Stock" thresholds to trigger proactive ordering.
- **Action Blue:** (`#3B82F6`) is used for primary interactive elements like "Add Item" or "Edit" to differentiate from status-based colors.

The background uses a cool-toned neutral gray to reduce eye strain during prolonged use. High-contrast text ensures WCAG AA compliance is met throughout the system.

## Typography

The typography system uses **Inter** for its exceptional legibility and neutral tone. It features a tall x-height which is critical for reading product SKUs and quantities quickly.

**Usage Guidelines:**
- **Headlines:** Use `headline-lg` for dashboard summaries. On mobile, revert to `headline-lg-mobile` to maximize vertical space.
- **Numerics:** For inventory counts and stock levels, use the `stats-numeric` style. It utilizes tabular lining to ensure numbers align perfectly in lists and tables, preventing visual jumping during updates.
- **Labels:** Small caps with increased letter spacing are used for secondary metadata (e.g., "SKU:", "LOCATION:").

## Layout & Spacing

This design system employs a **Fluid Grid** model optimized for PWA performance. 

- **Mobile (Warehouse Floor):** Uses a single-column layout with 16px side margins. Elements are vertically stacked with a minimum 48px touch target height to accommodate gloved hands or rapid tapping.
- **Desktop (Admin Office):** Transitions to a 12-column grid. Side margins expand to 32px. Data-heavy tables and inventory logs can span the full width or be contained in cards spanning 4-6 columns.
- **Rhythm:** An 8px base unit controls all spacing. Gutters are fixed at 16px to maintain a tight, organized structure even on large screens.

## Elevation & Depth

The system uses **Tonal Layering** combined with subtle shadows to create a hierarchy of information.

- **Level 0 (Background):** Solid neutral gray (`#F8FAFC`).
- **Level 1 (Cards):** White surfaces with a soft, 4px blur shadow (Opacity: 5%) and a 1px border (`#E2E8F0`). This defines the primary container for inventory items and metrics.
- **Level 2 (Active/Modals):** Elements that require immediate focus use a more pronounced 12px blur shadow.

Avoid heavy skeuomorphism. Depth is used only to indicate that a card is a distinct, interactive object or to separate "Pinned" items from the scrolling list.

## Shapes

The design system utilizes **Soft** roundedness (4px - 12px) to maintain a professional, systematic look while avoiding the clinical feel of sharp corners.

- **Standard Elements:** 4px radius (Buttons, Inputs).
- **Cards & Containers:** 8px radius.
- **Badges:** Fully pill-shaped (rounded-full) to distinguish them from interactive buttons.

This subtle rounding helps the eye distinguish between different UI containers without leaning into overly "playful" territory.

## Components

### Buttons
- **Primary:** Solid Indigo background with white text. High-contrast. Minimum height 48px on mobile.
- **Secondary:** Outline style with 1px Indigo border. Used for "Cancel" or "Edit".
- **Ghost:** No border or background. Used for navigation within cards.

### Functional Cards
- Inventory cards must include a "Quick Action" area on the right side for incrementing/decrementing stock without opening a detail view.
- Backgrounds are white, with a subtle border to separate them from the light gray app background.

### Status Badges
- **Low Stock:** Orange background, dark orange text.
- **Out of Stock:** Red background, white text.
- **In Stock:** Subtle green tint background with dark green text.

### Action-Oriented Forms
- Input fields use a 16px font size to prevent iOS "zoom-on-focus" behavior.
- Labels are always visible (no floating labels) to ensure context is never lost during data entry.

### Timeline / Log Pattern
- Vertical line connector for stock movement history.
- "Stock In" entries use a green dot; "Stock Out" entries use a red dot.
- Timestamps are formatted in `body-sm` for secondary importance.