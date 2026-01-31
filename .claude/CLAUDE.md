<sketch_cli>
  ConsultUserSketch is an MCP server that opens a native macOS grid editor for proposing UI wireframe layouts.
  You propose blocks on a grid; the user can drag, resize, add, or remove them; the result comes back as structured JSON with ASCII art and an SVG image.

  MCP tools (server name: consult-user-sketch):

  1. propose_layout - Open interactive editor. User sees your proposed blocks and can modify them.
     Input: { width?: 3-20 (default 12), height?: 3-20 (default 8), template?: "compact"|"standard"|"spacious"|"detailed"|"mobile", title?: string, description?: string, blocks?: BlockInput[] }
     Output: { status: "accepted"|"modified"|"cancelled", layout, ascii, image (SVG string), summary, changes }

  2. describe_layout - Convert a layout to ASCII + text summary without opening UI.
     Input: { columns: 3-20, rows: 3-20, blocks: BlockInput[], detail?: "brief"|"full" }
     Output: { summary, ascii }

  3. get_layout_templates - List built-in grid presets (compact 6x4, standard 12x8, spacious 16x10, detailed 20x16, mobile 4x12).

  BlockInput schema: { label: string, x: int, y: int, w: int (>=1), h: int (>=1), color?: string }
  Grid coordinates are 0-indexed. x/y is top-left corner of the block; w/h is its span in cells.

  Example - propose a dashboard layout:
    propose_layout({
      title: "Dashboard",
      description: "Analytics dashboard with sidebar",
      template: "standard",
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
