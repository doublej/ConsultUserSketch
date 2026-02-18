import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { SwiftSketchProvider } from "./providers/swift.js";
import type { LayoutResult, BlockInput } from "./types.js";

const DIALOG_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

type ContentBlock = { type: "text"; text: string };

function formatBlock(b: BlockInput): string {
  return `  - "${b.label}" at (${b.x},${b.y}) size ${b.w}×${b.h}`;
}

function formatLayoutResult(r: LayoutResult): ContentBlock[] {
  const blocks: ContentBlock[] = [];

  // Build readable text summary
  const lines: string[] = [`Status: ${r.status}`];

  if (r.summary) lines.push("", r.summary);

  if (r.changes?.length) {
    lines.push("", "Changes:");
    for (const c of r.changes) lines.push(`  - ${c}`);
  }

  if (r.layout?.blocks?.length) {
    lines.push("", `Grid: ${r.layout.columns}×${r.layout.rows}`, "Blocks:");
    for (const b of r.layout.blocks) lines.push(formatBlock(b));
  }

  if (r.ascii) lines.push("", "ASCII:", r.ascii);

  blocks.push({ type: "text", text: lines.join("\n") });

  // Save SVG to temp file, return path (avoid inline image processing)
  if (r.image) {
    const dir = join(tmpdir(), "consult-user-sketch");
    mkdirSync(dir, { recursive: true });
    const svgPath = join(dir, `layout-${Date.now()}.svg`);
    writeFileSync(svgPath, r.image);
    blocks.push({ type: "text", text: `\nImage: ${svgPath}` });
  }

  return blocks;
}

function isHeadless(): boolean {
  const env = process.env;
  return !!(env.SSH_CONNECTION || env.SSH_TTY || env.CI);
}

const server = new McpServer({ name: "consult-user-sketch", version: "1.0.0" });
const provider = new SwiftSketchProvider();
let proposeActive = false;

const blockSchema = z.object({
  label: z.string().min(1).max(50),
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  w: z.number().int().min(1),
  h: z.number().int().min(1),
  color: z.string().max(20).optional(),
});

const dimensionValue = z.union([
  z.number().int().min(1),
  z.enum(["hug", "fill"]),
]);

const layoutNodeSchema: z.ZodType = z.lazy(() =>
  z.object({
    id: z.string().min(1).max(50),
    role: z.enum(["header", "sidebar", "canvas", "footer", "toolbar", "panel"]).optional(),
    label: z.string().max(50).optional(),
    children: z.array(layoutNodeSchema).optional(),
    constraints: z.object({
      width: dimensionValue.optional(),
      height: dimensionValue.optional(),
    }).optional(),
    layout: z.object({
      direction: z.enum(["row", "column"]).optional(),
      gap: z.number().int().min(0).max(10).optional(),
    }).optional(),
    priority: z.number().int().min(0).optional(),
    color: z.string().max(20).optional(),
  })
);

server.registerTool("propose_layout", {
  description: "Open interactive grid layout editor. Accepts either explicit grid blocks or a semantic structure tree (direction/constraints-based). User can drag/resize/add/remove. Returns structured layout data + ASCII + SVG + text description. 10 min timeout.",
  inputSchema: z.object({
    width: z.number().int().min(3).max(20).default(12).describe("Grid columns (3-20)"),
    height: z.number().int().min(3).max(20).default(8).describe("Grid rows (3-20)"),
    template: z.enum(["compact", "standard", "spacious", "detailed", "mobile"]).optional()
      .describe("Preset template (overrides width/height)"),
    title: z.string().max(80).default("Layout Sketch").describe("Dialog title"),
    description: z.string().max(200).optional().describe("Description shown in dialog"),
    blocks: z.array(blockSchema).default([]).describe("Initial blocks with grid coordinates (alternative to structure)"),
    structure: layoutNodeSchema.optional().describe("Semantic layout tree with direction/constraints (alternative to blocks)"),
  }),
}, async (p) => {
  if (isHeadless()) {
    throw new Error("Interactive layout editor requires a desktop environment (unavailable over SSH/CI)");
  }
  if (proposeActive) {
    throw new Error("An interactive layout session is already running. Complete or cancel it first.");
  }

  proposeActive = true;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DIALOG_TIMEOUT_MS);
  try {
    const r = await provider.propose({
      width: p.width,
      height: p.height,
      template: p.template,
      title: p.title,
      description: p.description,
      blocks: p.blocks,
      structure: p.structure,
    }, controller.signal);
    return { content: formatLayoutResult(r) };
  } finally {
    clearTimeout(timeout);
    proposeActive = false;
  }
});

server.registerTool("get_layout_templates", {
  description: "Returns predefined grid templates so LLM can pick appropriate density for a layout.",
  inputSchema: z.object({}),
}, async () => {
  const r = await provider.templates();
  return { content: [{ type: "text", text: JSON.stringify(r) }] };
});

server.registerTool("describe_layout", {
  description: "Convert a layout to human-readable text and ASCII art without opening UI. Accepts either explicit grid blocks or a semantic structure tree.",
  inputSchema: z.object({
    columns: z.number().int().min(3).max(20).describe("Grid columns"),
    rows: z.number().int().min(3).max(20).describe("Grid rows"),
    blocks: z.array(blockSchema).optional().describe("Blocks with grid coordinates (alternative to structure)"),
    structure: layoutNodeSchema.optional().describe("Semantic layout tree (alternative to blocks)"),
    detail: z.enum(["brief", "full"]).default("full").describe("Level of detail"),
  }).refine(d => d.blocks?.length || d.structure, {
    message: "Provide either blocks or structure",
  }),
}, async (p) => {
  const r = await provider.describe({
    columns: p.columns,
    rows: p.rows,
    blocks: p.blocks,
    structure: p.structure,
    detail: p.detail as "brief" | "full",
  });
  return { content: [{ type: "text", text: JSON.stringify(r) }] };
});

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ConsultUserSketch MCP Server running on stdio");
}

main().catch((e) => { console.error("Server error:", e); process.exit(1); });
