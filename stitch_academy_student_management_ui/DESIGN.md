---
name: Academy Student Workspace
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#58423c'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#8b716b'
  outline-variant: '#dfc0b8'
  surface-tint: '#a7391e'
  primary: '#a7391e'
  on-primary: '#ffffff'
  primary-container: '#ff7a59'
  on-primary-container: '#701500'
  inverse-primary: '#ffb4a2'
  secondary: '#575e70'
  on-secondary: '#ffffff'
  secondary-container: '#d9dff5'
  on-secondary-container: '#5c6274'
  tertiary: '#585f6c'
  on-tertiary: '#ffffff'
  tertiary-container: '#9ba2b1'
  on-tertiary-container: '#323945'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad2'
  primary-fixed-dim: '#ffb4a2'
  on-primary-fixed: '#3c0700'
  on-primary-fixed-variant: '#862208'
  secondary-fixed: '#dce2f7'
  secondary-fixed-dim: '#c0c6db'
  on-secondary-fixed: '#141b2b'
  on-secondary-fixed-variant: '#404758'
  tertiary-fixed: '#dce2f3'
  tertiary-fixed-dim: '#c0c7d6'
  on-tertiary-fixed: '#151c27'
  on-tertiary-fixed-variant: '#404754'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-md:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: DM Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system translates the clarity of high-fidelity wireframe prototypes into an intentional, high-utility student management platform for modern academies. Built for administrative leads, academic advisors, and students, the visual language merges the focus of monochrome productivity wireframes with precise geometric warmth.

The emotional signature is quiet confidence: unburdened by heavy shadows or decorative gradients, the interface establishes a tactile, paper-clean environment. The style blends refined modern minimalism with soft, tactile containment. Crisp pure-white surfaces sit over warm off-white canvases, structured with hairline boundaries and deep charcoal anchors. The vivid coral seed color acts as an editorial catalyst—drawing immediate focus to active academic progress, status flags, key deadlines, and primary milestones without causing visual fatigue.

## Colors

The palette derives from the high-contrast wireframe aesthetic, balanced by a sharp coral accent that commands attention:

- **Primary (`#FF7A59`)**: The high-impact accent extracted directly from graphic branding elements. Used selectively for key highlight moments, live attendance metrics, actionable progress flags, and active status indicators.
- **Secondary (`#111827`)**: Deep obsidian charcoal. Serves as the primary anchor for dominant interactive states, active navigation pills, primary operational buttons, and high-emphasis display titles.
- **Tertiary (`#6B7280`)**: Muted slate neutral used for supporting metadata, subheadings, unselected states, and structural track lines in calendar timelines.
- **Neutral / Canvas (`#F4F5F7`)**: The foundational canvas backdrop providing soft contrast beneath pure `#FFFFFF` structural cards.
- **Surface Stroke (`#E5E7EB`)**: Precise low-opacity hairline border applied across elevated cards, date chips, and compartmentalized metrics.

## Typography

Typography pairs **Outfit** for headlines and high-level milestones with **DM Sans** for operational tracking and data densities:

- **Outfit (Display & Headings)**: Geometric shapes, circular counters, and sharp terminals evoke modern architectural draftsmanship. Applied to section greetings (e.g., "Hello Dr. Brooks", "Semester Cohort A"), high-level statistics, and top-tier modal headings.
- **DM Sans (Body & Controls)**: Low-contrast, hyper-legible humanist qualities ensure dense course lists, student rosters, academic grade summaries, and timestamps remain readable at 11px to 14px sizes.
- **Hierarchy Rules**: Primary labels and card titles adopt medium-to-bold weights in obsidian charcoal (`#111827`), paired immediately with body-sm or label-sm descriptions in neutral tertiary gray (`#6B7280`).

## Layout & Spacing

The application architecture utilizes a structured 12-column desktop fluid workspace anchored by a persistent collapsible navigation column (280px default width):

- **Grid & Gutters**: Content regions use standard 24px (`1.5rem`) gutters on wide desktop displays, tightening to 20px (`1.25rem`) on compact views.
- **Canvas Margins**: External padding around dashboard surfaces is set to 40px (`2.5rem`) on desktop screens, ensuring visual breathing space around grouped card surfaces.
- **Rhythm Scale**: Spacing strictly adheres to an 8-point rhythm. Internal card margins use `space-lg` (24px) for prominent dashboards and `space-md` (16px) for itemized student lists and schedule queues.
- **Reflow Rules**: Multi-column student tracking decks collapse from 3 columns down to 2 columns under 1280px widths, and drop into single-column timeline feeds below 960px.

## Elevation & Depth

Visual hierarchy follows a planar, soft-wireframe philosophy. Depth relies on tonal surface transitions accented by diffuse, low-opacity ambient drop shadows:

- **Layer 0 (Canvas Base)**: `#F4F5F7` flat matte background across all views.
- **Layer 1 (Card & Module Surfaces)**: Pure `#FFFFFF` fill bounded by a 1px uniform hairline stroke (`#E5E7EB`). Elevated with an ambient shadow: `0px 4px 20px -2px rgba(17, 24, 39, 0.04)`.
- **Layer 2 (Floating Pills, Active Selectors & Flyouts)**: `#FFFFFF` or `#111827` floating containers elevated via `0px 8px 24px -4px rgba(17, 24, 39, 0.08)`.
- **Layer 3 (Overlays, Slide-overs, & Dialogs)**: Modals sit above a 30% alpha charcoal scrim (`rgba(17, 24, 39, 0.35)`), with `0px 16px 36px -8px rgba(17, 24, 39, 0.12)`.

## Shapes

The interface balances soft curved surfaces with high-radius pill geometries:

- **Structural Panels & Dashboard Modules**: Defined with `rounded-2xl` (16px / `1rem`) corner radii, echoing the wireframe cards.
- **Interactive Controls & Filter Chips**: Strict fully-pill geometries (`border-radius: 9999px`) for category tabs, calendar day toggles, segmented controls, and button triggers.
- **Sub-Containers & List Tile Items**: Soft internal groupings (such as syllabus task modules or grade rows) employ `rounded-lg` (8px / `0.5rem`) for a clean nested structure.

## Components

### 1. Buttons & Control Pills
- **Primary Operational Action**: Solid charcoal (`#111827`) fill, white text (`#FFFFFF`), `font-weight: 500`, fully-rounded pill shape (`rounded-full`), padded `10px 24px`. Hover triggers a dark neutral shift (`#1F2937`).
- **Accent Highlight Action**: Vivid coral (`#FF7A59`) fill, white text (`#FFFFFF`), used for high-importance workflows (e.g., "Enroll Student", "Publish Grades"). Hover shifts to `#F97316`.
- **Secondary / Filter Tabs**: Inactive states use transparent or `#F3F4F6` backgrounds with `#6B7280` text. Active state transitions to solid `#111827` fill with white text.

### 2. Cards & Progress Containers
- **Content Cards**: Built on `#FFFFFF` with a 1px border (`#E5E7EB`) and soft 16px corner radius.
- **Metric Rings & Gauges**: Circular progress indicators inspired by consumption gauges. Track paths use a 4px stroke in `#F3F4F6`; active fills use `#111827` or `#FF7A59` with a centered bold counter value in `Outfit`.

### 3. Timeline & Cohort Milestones
- **Vertical Activity Track**: Connected by a vertical 1.5px dotted or solid `#E5E7EB` spine line. 
- **Milestone Nodes**: Circular markers (10px diameter) in `#D1D5DB` with the current active milestone highlighted in solid `#FF7A59` with an outer soft concentric halo.

### 4. Inputs & Search Fields
- **Search & Input Bars**: Soft white background (`#FFFFFF`), 1px continuous stroke (`#E5E7EB`), `rounded-full` pill structure with inset search icon (`#9CA3AF`) and light placeholder text. Focus triggers a 1.5px outline in `#111827`.

### 5. Calendar & Date Scrollers
- **Horizontal Day Picker**: Horizontal pill segments featuring abbreviated day-of-week (`label-sm`, `#6B7280`) over numeric date (`headline-sm`, `#111827`). Active selection applies a solid `#111827` rounded-full container with white inverted text.