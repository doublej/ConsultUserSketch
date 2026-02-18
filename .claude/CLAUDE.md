<sketch_cli>
  ConsultUserSketch is an MCP server that opens a native macOS grid editor for proposing UI wireframe layouts.
  You propose blocks on a grid; the user can drag, resize, add, or remove them; the result comes back as structured JSON with ASCII art and an SVG image.

  MCP tools (server name: consult-user-sketch):

  1. propose_layout - Open interactive editor. User sees your proposed blocks and can modify them.
     Input: { width?, height?, template?, title?, description?, blocks?: BlockInput[], structure?: LayoutNode }
     Output: { status: "accepted"|"modified"|"cancelled", layout, ascii, image (SVG string), summary, changes }

  2. describe_layout - Convert a layout to ASCII + text summary without opening UI.
     Input: { columns, rows, blocks?: BlockInput[], structure?: LayoutNode, detail?: "brief"|"full" }
     Output: { summary, ascii }
     Requires at least one of blocks or structure.

  3. get_layout_templates - List built-in grid presets (compact 6x4, standard 12x8, spacious 16x10, detailed 20x16, mobile 4x12).

  ## Input formats

  Two ways to specify blocks — use whichever is more natural for the layout:

  ### Grid coordinates (blocks)
  BlockInput: { label: string, x: int, y: int, w: int (>=1), h: int (>=1), color?: string }
  Grid coordinates are 0-indexed. x/y is top-left corner; w/h is span in cells.

  ### Semantic structure (structure) — preferred
  LayoutNode tree describing layout intent with direction and constraints. The compiler resolves it to grid blocks.

  LayoutNode: {
    id: string,                          // region identifier (used as block label)
    role?: "header"|"sidebar"|"canvas"|"footer"|"toolbar"|"panel",  // semantic hint (nodes with role are visible)
    label?: string,                      // display label (overrides id)
    children?: LayoutNode[],             // nested regions
    constraints?: {
      width?: "hug"|"fill"|number,       // hug=1 cell, fill=remaining, number=fixed cells
      height?: "hug"|"fill"|number       // defaults: fill
    },
    layout?: {
      direction?: "row"|"column",        // stacking direction (default: column)
      gap?: number                       // cells between children (default: 0)
    },
    priority?: number,                   // higher priority fill nodes get more space
    color?: string
  }

  Rules:
  - Root gets full grid bounds. Children distributed along parent's direction.
  - Fixed/hug children allocated first, remaining space split among fill children.
  - Leaf nodes become visible blocks. Container nodes with role also become blocks. Structural-only containers (no role, has children) are invisible.

  ## Examples

  Semantic structure (preferred):
    propose_layout({
      template: "standard",
      title: "Dashboard",
      structure: {
        id: "root", layout: { direction: "column" },
        children: [
          { id: "Header", role: "header", constraints: { height: 2 } },
          { id: "body", layout: { direction: "row" }, children: [
            { id: "Sidebar", role: "sidebar", constraints: { width: 3 } },
            { id: "content", layout: { direction: "column" }, children: [
              { id: "body-top", layout: { direction: "row" }, children: [
                { id: "Chart", constraints: { width: "fill" } },
                { id: "Stats", constraints: { width: 4 } }
              ]},
              { id: "Table", constraints: { height: 2 } }
            ]}
          ]}
        ]
      }
    })

  Grid coordinates (alternative):
    propose_layout({
      template: "standard",
      title: "Dashboard",
      blocks: [
        { label: "Sidebar", x: 0, y: 0, w: 3, h: 8 },
        { label: "Header",  x: 3, y: 0, w: 9, h: 2 },
        { label: "Chart",   x: 3, y: 2, w: 5, h: 4 },
        { label: "Stats",   x: 8, y: 2, w: 4, h: 4 },
        { label: "Table",   x: 3, y: 6, w: 9, h: 2 }
      ]
    })

  When to use:
  - User asks about page layout, wireframes, or UI structure.
  - Planning component placement for a new page or dashboard.
  - Discussing information architecture that benefits from visual feedback.
  - Use describe_layout to recap a layout in text without interrupting the user.
  - Use propose_layout when you want the user to review and adjust visually.

  Notes:
  - The `image` field in responses contains a raw SVG string (800x600) suitable for rendering.
  - If status is "cancelled", the user dismissed the editor; do not repeat the proposal.
  - If status is "modified", read the `changes` array to understand what the user adjusted.
  - Pick a template that fits the complexity: compact for simple pages, detailed for dense wireframes, mobile for phone layouts.
</sketch_cli>
