import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { SwiftSketchProvider } from "./providers/swift.js";

const DIALOG_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Dialog timed out after ${ms / 1000}s`)), ms)
    ),
  ]);
}

const server = new McpServer({ name: "consult-user-sketch", version: "1.0.0" });
const provider = new SwiftSketchProvider();

const blockSchema = z.object({
  label: z.string().min(1).max(50),
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  w: z.number().int().min(1),
  h: z.number().int().min(1),
  color: z.string().max(20).optional(),
});

server.registerTool("propose_layout", {
  description: "Open interactive grid layout editor. LLM proposes blocks, user can drag/resize/add/remove. Returns structured layout data + ASCII + PNG + text description. 10 min timeout.",
  inputSchema: z.object({
    width: z.number().int().min(3).max(20).default(12).describe("Grid columns (3-20)"),
    height: z.number().int().min(3).max(20).default(8).describe("Grid rows (3-20)"),
    template: z.enum(["compact", "standard", "spacious", "detailed", "mobile"]).optional()
      .describe("Preset template (overrides width/height)"),
    title: z.string().max(80).default("Layout Sketch").describe("Dialog title"),
    description: z.string().max(200).optional().describe("Description shown in dialog"),
    blocks: z.array(blockSchema).default([]).describe("Initial blocks to place on grid"),
  }),
}, async (p) => {
  const r = await withTimeout(provider.propose({
    width: p.width,
    height: p.height,
    template: p.template,
    title: p.title,
    description: p.description,
    blocks: p.blocks,
  }), DIALOG_TIMEOUT_MS);
  return { content: [{ type: "text", text: JSON.stringify(r) }] };
});

server.registerTool("get_layout_templates", {
  description: "Returns predefined grid templates so LLM can pick appropriate density for a layout.",
  inputSchema: z.object({}),
}, async () => {
  const r = await provider.templates();
  return { content: [{ type: "text", text: JSON.stringify(r) }] };
});

server.registerTool("describe_layout", {
  description: "Convert a layout to human-readable text and ASCII art without opening UI. Useful for understanding layout structure.",
  inputSchema: z.object({
    columns: z.number().int().min(3).max(20).describe("Grid columns"),
    rows: z.number().int().min(3).max(20).describe("Grid rows"),
    blocks: z.array(blockSchema).min(1).describe("Blocks in the layout"),
    detail: z.enum(["brief", "full"]).default("full").describe("Level of detail"),
  }),
}, async (p) => {
  const r = await provider.describe({
    columns: p.columns,
    rows: p.rows,
    blocks: p.blocks,
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
