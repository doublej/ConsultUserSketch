import { readFileSync } from "node:fs";
import { join } from "node:path";
import { encodingForModel } from "js-tiktoken";

const MAX_SINGLE_TOKENS = parseInt(process.env.MAX_SINGLE_TOKENS ?? "200", 10);
const MAX_TOTAL_TOKENS = parseInt(process.env.MAX_TOTAL_TOKENS ?? "1500", 10);

const root = join(import.meta.dir, "..");
const enc = encodingForModel("gpt-4o"); // cl100k_base

function extractToolDescriptions(src: string): { name: string; description: string }[] {
  const re = /\.registerTool\(\s*"([^"]+)"\s*,\s*\{[^}]*description:\s*"([^"]+)"/g;
  const results: { name: string; description: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    results.push({ name: m[1], description: m[2] });
  }
  return results;
}

function extractPromptBlock(src: string): string | null {
  const re = /<sketch_cli>([\s\S]*?)<\/sketch_cli>/;
  const m = re.exec(src);
  return m ? m[0] : null;
}

function countTokens(text: string): number {
  return enc.encode(text).length;
}

// --- Read sources ---
const indexSrc = readFileSync(join(root, "mcp-server/src/index.ts"), "utf-8");
const claudeMd = readFileSync(join(root, ".claude/CLAUDE.md"), "utf-8");

const tools = extractToolDescriptions(indexSrc);
const promptBlock = extractPromptBlock(claudeMd);

if (tools.length === 0) {
  console.error("No tool descriptions found in index.ts");
  process.exit(1);
}

// --- Token counts ---
const rows: { name: string; chars: number; tokens: number }[] = tools.map((t) => ({
  name: t.name,
  chars: t.description.length,
  tokens: countTokens(t.description),
}));

const promptTokens = promptBlock ? countTokens(promptBlock) : 0;

// --- Print table ---
const nameW = Math.max(20, ...rows.map((r) => r.name.length));
const header = `${"Tool".padEnd(nameW)}  ${"Chars".padStart(6)}  ${"Tokens".padStart(7)}`;
console.log(header);
console.log("-".repeat(header.length));

for (const r of rows) {
  console.log(`${r.name.padEnd(nameW)}  ${String(r.chars).padStart(6)}  ${String(r.tokens).padStart(7)}`);
}

console.log("-".repeat(header.length));
const descTotal = rows.reduce((s, r) => s + r.tokens, 0);
console.log(`${"Descriptions total".padEnd(nameW)}  ${"".padStart(6)}  ${String(descTotal).padStart(7)}`);

if (promptBlock) {
  console.log(`${"Prompt block".padEnd(nameW)}  ${String(promptBlock.length).padStart(6)}  ${String(promptTokens).padStart(7)}`);
}

const grandTotal = descTotal + promptTokens;
console.log(`${"TOTAL".padEnd(nameW)}  ${"".padStart(6)}  ${String(grandTotal).padStart(7)}`);
console.log();

// --- Threshold checks ---
let failed = false;

for (const r of rows) {
  if (r.tokens > MAX_SINGLE_TOKENS) {
    console.error(`FAIL: "${r.name}" uses ${r.tokens} tokens (max ${MAX_SINGLE_TOKENS})`);
    failed = true;
  }
}

if (grandTotal > MAX_TOTAL_TOKENS) {
  console.error(`FAIL: total ${grandTotal} tokens exceeds max ${MAX_TOTAL_TOKENS}`);
  failed = true;
}

if (failed) {
  process.exit(1);
}

console.log("OK: all descriptions within token limits");
