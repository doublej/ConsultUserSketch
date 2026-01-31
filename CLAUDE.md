# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run

```bash
# Full build (Swift release + TypeScript)
bun run build

# Swift only (debug for dev, release for MCP)
cd sketch-cli && swift build
cd sketch-cli && swift build -c release

# TypeScript only
cd mcp-server && bun run tsc

# Run MCP server
node mcp-server/dist/index.js
```

The MCP server locates the Swift binary at `sketch-cli/.build/release/SketchCLI` (preferred) or `sketch-cli/.build/debug/SketchCLI` (fallback). Build Swift before running the server.

No test suite exists yet. Verify changes by building both targets and running the CLI manually:
```bash
sketch-cli/.build/debug/SketchCLI templates
sketch-cli/.build/debug/SketchCLI describe '{"columns":4,"rows":3,"blocks":[{"label":"Test","x":0,"y":0,"w":2,"h":1}]}'
```

## Architecture

Two-component system: a TypeScript MCP server that spawns a Swift CLI as a subprocess.

```
Claude ──MCP──▶ mcp-server (TS)  ──execFile + JSON──▶ sketch-cli (Swift/SwiftUI)
                │                                      │
                │ 3 tools:                             │ 4 commands:
                │  propose_layout                      │  propose  (interactive window)
                │  describe_layout                     │  describe (non-interactive)
                │  get_layout_templates                │  render   (non-interactive)
                │                                      │  templates
                └──────────────────────────────────────┘
```

**MCP Server** (`mcp-server/src/`): Validates input with Zod, calls `SwiftSketchProvider` which runs the CLI binary, parses JSON stdout.

**Swift CLI** (`sketch-cli/Sources/SketchCLI/`): Grid-based layout editor. The `propose` command opens a modal NSWindow with SwiftUI content (drag/resize/rename blocks), blocks until user accepts or cancels, then returns JSON with layout + ASCII + SVG + text summary + change diff.

### Key data flow
- All positioning uses integer grid coordinates (`x, y, w, h` in cells)
- `SketchManager.propose()` runs a modal event loop, diffs original vs final layout
- Nesting is auto-detected: a block fully contained in another gets dashed borders and indented descriptions

### Swift source layout
- `Models/` — `GridBlock`, `GridLayout`, `DensityTemplate`, request/response Codables
- `Services/SketchManager` — Editor lifecycle, layout diffing, window creation
- `Views/` — `SketchEditorView` (main), `GridCanvasView` (grid + blocks), `BlockView` (drag/resize gestures), `AddBlockSheet`
- `Rendering/` — `AsciiRenderer`, `SvgRenderer`, `DescriptionRenderer`, `ColorPalette`
- `Window/` — Custom borderless `NSWindow` (ESC = cancel), `WindowDragArea`
- `Theme/` — Dark theme NSColor constants
- `Components/` — `FocusableButton` (AppKit button with keyboard/hover support)

### MCP server source layout
- `index.ts` — Tool registration and Zod schemas
- `types.ts` — Shared TypeScript interfaces
- `providers/interface.ts` — `SketchProvider` protocol
- `providers/swift.ts` — Subprocess execution, binary discovery, JSON marshalling

## Conventions

- Swift targets macOS 14+, Swift 5.9+
- TypeScript targets ES2022, strict mode, NodeNext modules
- MCP server uses `bun` for package management
- Block colors auto-assigned from a 12-color palette if not specified
- All CLI output is pretty-printed, sorted-key JSON to stdout
