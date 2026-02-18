# Sketch MCP Dialog Layout Proposal

Current layout of the SketchEditorView window (700x500px).

## MCP Call

```json
{
  "tool": "propose_layout",
  "args": {
    "width": 16,
    "height": 10,
    "title": "Sketch Editor Dialog",
    "description": "Current layout of the consult-user-sketch editor window (700x500)",
    "blocks": [
      { "label": "Title + Description", "x": 0, "y": 0, "w": 14, "h": 1 },
      { "label": "Grid Size Badge", "x": 14, "y": 0, "w": 2, "h": 1 },
      { "label": "Add Element", "x": 0, "y": 1, "w": 3, "h": 2 },
      { "label": "Grid Canvas", "x": 3, "y": 1, "w": 13, "h": 7 },
      { "label": "Instructions", "x": 0, "y": 8, "w": 7, "h": 2 },
      { "label": "Undo/Redo", "x": 7, "y": 8, "w": 3, "h": 2 },
      { "label": "Cancel", "x": 10, "y": 8, "w": 3, "h": 2 },
      { "label": "Accept", "x": 13, "y": 8, "w": 3, "h": 2 }
    ]
  }
}
```

## Layout Notes

- **Window**: 700x500px, borderless with rounded corners (12px radius)
- **Title bar**: Title (bold 18pt) + optional description (13pt) left-aligned, grid dimensions badge (e.g. "12x8") right-aligned in a capsule
- **Sidebar**: 120px wide, contains "Add Element" button (plus icon + label, 72px tall)
- **Grid Canvas**: Fills remaining space, shows grid lines and coloured blocks
- **Bottom bar**: Help text left ("Drag to move..." + keyboard shortcuts), undo/redo buttons, Cancel (120x48) and Accept (140x48) buttons right-aligned
- **Draggable**: Window can be dragged from the title bar area
- **ESC**: Dismisses (cancels) the dialog
