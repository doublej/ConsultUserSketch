# Sketch Visual Improvements — Research Findings

Brainstormed by 5 parallel opus agents, each covering a different angle. All proposals share the same architectural approach: optional fields on `GridBlock`, backwards-compatible, auto-inferrable from labels.

## Highest-impact features (cross-agent consensus)

1. **Content type wireframes** — Single `content` field renders mini-wireframes inside blocks (skeleton lines for text, crossed rectangles for images, play buttons for video, table rows for data). Biggest visual upgrade for least effort.
2. **Hierarchy/importance** — `importance: "primary" | "secondary" | "tertiary"` adjusts fill opacity, border weight, and shadow. Zero new UI controls.
3. **Role propagation** — The `LayoutCompiler` currently discards `role`, `direction`, `gap`, and `constraints` from the semantic tree. Preserving these on `GridBlock` unlocks surface zones, flow indicators, spacing annotations, and nesting improvements.

---

## 1. Visual Fidelity — Block Appearance

### 1.1 Content previews

Add `contentType` to `GridBlock`. Each type renders a placeholder illustration inside the block:

| contentType | Rendering |
|-------------|-----------|
| `text` | 3–4 horizontal skeleton bars, last one shorter (ragged paragraph) |
| `image` | Diagonal cross with `photo` SF Symbol centred |
| `avatar` | Circle with `person.fill` silhouette |
| `button` | Centred pill shape with label text |
| `input` | Horizontal line near bottom with cursor bar |
| `list` | Stacked rows with dots/numbers |
| `chart` | Vertical bars of varying height |
| `map` | Crosshair/pin icon with faint grid lines |
| `video` | Large play triangle centred |

All drawn with block color at ~15% opacity. Auto-inferred from labels ("Hero Image" → `image`).

### 1.2 Elevation / shadow

`elevation: 0 | 1 | 2 | 3` on `GridBlock`.

| Level | Shadow | Fill opacity | Use case |
|-------|--------|-------------|----------|
| 0 | None | 0.25 | Default, flat |
| 1 | Subtle (radius 2, y 1) | 0.30 | Cards, raised surfaces |
| 2 | Medium (radius 6, y 3) | 0.40 | Floating panels, popovers |
| 3 | Heavy (radius 12, y 6) + scrim | 0.55 | Modals, overlays |

Auto-inferred: "Modal" / "Dialog" → 3, "Card" → 1.

### 1.3 Prominence / opacity

`prominence: "primary" | "secondary" | "muted" | "background"` on `GridBlock`.

| Level | Fill | Stroke | Label |
|-------|------|--------|-------|
| primary | 0.35 | Full, 2.5px | Always visible |
| secondary | 0.25 | Full, 1px | On hover (current) |
| muted | 0.12 | 0.4 opacity | Reduced opacity |
| background | 0.06 | Dotted, 0.2 | Semi-transparent |

Blocks fully containing others auto-default to `background`.

### 1.4 Typography hints

Three optional fields: `textSize` (`xl`/`lg`/`md`/`sm`/`xs`), `textWeight` (`bold`/`medium`/`light`), `textAlign` (`leading`/`center`/`trailing`). When set, the label renders permanently inside the block at the specified style instead of only on hover.

### 1.5 Border styles

Three optional fields: `borderStyle` (`solid`/`dashed`/`none`), `cornerRadius` (`none`/`sm`/`md`/`lg`/`pill`), `borderSides` (`all`/`bottom`/`top`). Replaces the current hardcoded `RoundedRectangle(cornerRadius: 6)`.

---

## 2. Semantic Enrichment

### 2.1 Block type annotations

`type` field on `GridBlock` (e.g. `"button"`, `"image"`, `"textInput"`, `"navigation"`, `"table"`). Renders a small badge at top-right with abbreviation ("BTN", "IMG", "NAV"), mirroring the existing number badge at top-left.

### 2.2 SF Symbol icons

`icon` field on `GridBlock` (SF Symbol name). Renders centred in block at 30% opacity as a watermark. Auto-inferred from type/role via lookup table:

| Type/Role | Default icon |
|-----------|-------------|
| navigation | `sidebar.left` |
| button | `hand.tap` |
| image | `photo` |
| table | `tablecells` |
| search | `magnifyingglass` |

### 2.3 Interactive state indicators

`traits: [String]` on `GridBlock` (e.g. `["clickable", "scrollable", "expandable"]`). Renders as tiny SF Symbol glyphs along bottom-left edge:

- `clickable` → `cursorarrow.click`
- `scrollable` → `arrow.up.arrow.down`
- `expandable` → `chevron.down`
- `draggable` → `arrow.up.and.down.and.arrow.left.and.right`
- `editable` → `pencil`

### 2.4 Responsive behaviour hints

`responsive: "grow" | "shrink" | "fixed" | "wrap" | "hide" | "collapse"` on `GridBlock`. Small icon at centre-right edge:

- `grow` → double-headed arrow + subtle spring pattern on right edge
- `fixed` → lock icon
- `hide` → eye-slash + reduced fill opacity

### 2.5 Hierarchy/importance cues

`importance: "primary" | "secondary" | "tertiary"` on `GridBlock`. Modifies border width (2.5/1/0.5), fill opacity (0.35/0.25/0.12), border style (solid/solid/dashed), and badge size. Primary blocks get a subtle glow shadow. Auto-inferrable from `role`: `canvas` → primary, `header`/`sidebar` → secondary, `toolbar`/`panel` → tertiary.

---

## 3. Layout Relationships

### 3.1 Spacing/gap visualisation

`gapAfter: { direction, size }` on `GridBlock`, populated by `LayoutCompiler` from parent's `gap` value. Renders a dashed line spanning the gap with a centred pill badge showing the cell count.

### 3.2 Alignment guides

No model changes — computed at render time from block positions. On hover/drag, thin cyan guide lines connect blocks sharing the same edge coordinate. Doubles as snap indicators during drag.

### 3.3 Flow direction indicators

`flowDirection: "row" | "column"` on `GridBlock` (for container blocks). Renders a small directional arrow next to the number badge: → for row, ↓ for column.

### 3.4 Grouping/nesting improvements

Three new fields: `parentId` (explicit parent link), `nestingDepth` (0 = top-level), `isContainer` (has children). Visual changes:

- Containers get a permanent "tab" header showing the label
- Border style varies by depth: solid → long-dash → short-dash
- Fill opacity decreases with depth: 0.25 → 0.15 → 0.08

### 3.5 Proportional sizing hints

`sizing: { width, height }` on `GridBlock` where each axis is `"fill"`, `"hug"`, or a fixed number. Renders a small pill badge at bottom-left: `<->` for fill, `><` for hug, or the number for fixed.

---

## 4. Content Simulation

Unified via a single `content` enum on `GridBlock` with discriminated types:

### 4.1 Text content

`{ type: "text", lines?: number, style?: "paragraph" | "heading" | "caption" }`

- `paragraph` — multiple skeleton bars, last one shorter
- `heading` — one thick bar at top + thinner bars below
- `caption` — two short thin bars, bottom-aligned

### 4.2 List/table content

`{ type: "list", itemCount?: number, variant?: "list" | "table" | "grid" | "feed" }`

- `list` — horizontal separator lines with short bars
- `table` — rows + vertical column dividers + bold header row
- `grid` — 2×2 or 2×3 mini-grid of small rectangles
- `feed` — rows with small square (thumbnail) + two bars (title/meta)

Overflow shows a faded gradient at bottom suggesting scrollability.

### 4.3 Media content

`{ type: "media", mediaType?: "image" | "video" | "map" | "avatar", aspect?: "landscape" | "portrait" | "square" }`

Inner rectangle proportioned to `aspect`, centred SF Symbol icon (`photo`/`play.fill`/`mappin`/`person.crop.circle`). Avatar always renders as circle.

### 4.4 Navigation content

`{ type: "nav", navType?: "tabs" | "breadcrumb" | "menu" | "bottomBar", itemCount?: number }`

- `tabs` — equal-width pill segments, one "active"
- `breadcrumb` — small rectangles separated by chevrons
- `menu` — vertically stacked bars of varying width
- `bottomBar` — evenly spaced circles/squares in a row

### 4.5 Form content

`{ type: "form", fields?: [{ fieldType: "input" | "button" | "checkbox" | "toggle" | "select" | "textarea" }] }`

Fields stacked vertically with mini-wireframe per type. Auto-generates sensible defaults from block height when `fields` is omitted.

---

## 5. Context & Polish

### 5.1 Background surface zones

Propagate `role` from `LayoutNode` to `GridBlock`. Grid cells behind blocks with a role get a faint tint (3–5% opacity):

| Role | Tint |
|------|------|
| header / footer | Warm gray |
| sidebar / toolbar | Cool blue-gray |
| canvas / panel | Neutral |

### 5.2 Device frame

`frame: "browser" | "phone" | "tablet"` on `GridLayout`. Wraps the canvas in non-interactive device chrome:

- **browser** — Title bar with traffic light dots + URL bar
- **phone** — Rounded bezel + status bar (time, signal, battery)
- **tablet** — Wider bezel, thinner border

The "mobile" template could auto-set `frame: "phone"`.

### 5.3 Annotations

`annotations: [{ x, y, text }]` on `GridLayout`. Numbered callout markers (circled numbers on amber background) with leader lines pointing to target cells. Legend panel below canvas lists annotation text. Read-only (set by AI to explain design rationale).

### 5.4 Component reuse indicators

`componentId` on `GridBlock`. Blocks sharing the same ID get a stacked-squares icon (top-right) and synchronized hover highlighting. Tooltip shows instance count ("Product Card (1 of 3)").

### 5.5 Theme preview toggle

No model changes. Sun/moon toggle in editor toolbar swaps canvas between dark and light surface. Block fills adapt opacity. Editor chrome stays unchanged.

---

## Proposed model changes summary

### GridBlock — new optional fields

| Field | Type | Default | Source |
|-------|------|---------|--------|
| `content` | `BlockContent` enum | nil | AI-inferred + explicit |
| `role` | String | nil | From semantic tree |
| `elevation` | Int (0–3) | 0 | AI-inferred + explicit |
| `prominence` | String | "secondary" | Mostly explicit |
| `importance` | String | "secondary" | AI-inferred + explicit |
| `type` | String | nil | AI-inferred + explicit |
| `icon` | String (SF Symbol) | nil | Auto from type/role |
| `traits` | [String] | nil | AI explicit |
| `responsive` | String | nil | AI explicit |
| `componentId` | String | nil | AI explicit |
| `parentId` | String | nil | From semantic tree |
| `nestingDepth` | Int | 0 | From semantic tree |
| `flowDirection` | String | nil | From semantic tree |

### GridLayout — new optional fields

| Field | Type | Default |
|-------|------|---------|
| `frame` | String | nil |
| `annotations` | [Annotation] | nil |

### Implementation priority

1. `content` (content type wireframes) — biggest visual impact, one field
2. `role` propagation — unlocks surface zones + multiple other features
3. `importance`/`prominence` — hierarchy at a glance, rendering-only changes
4. `elevation` — one integer, four shadow levels
5. `frame` — device context, new wrapper view
6. Everything else — incremental value
