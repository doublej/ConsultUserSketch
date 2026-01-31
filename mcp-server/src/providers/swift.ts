import { execFile } from "child_process";
import { promisify } from "util";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import type { SketchProvider } from "./interface.js";
import type {
  ProposeOptions,
  LayoutResult,
  DescribeOptions,
  DescribeResult,
  TemplatesResult,
} from "../types.js";

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function findSketchCli(): string | null {
  // Dev: mcp-server/dist/providers -> sketch-cli/.build/release/SketchCLI
  const releasePath = join(__dirname, "..", "..", "..", "sketch-cli", ".build", "release", "SketchCLI");
  if (existsSync(releasePath)) return releasePath;

  // Debug build fallback
  const debugPath = join(__dirname, "..", "..", "..", "sketch-cli", ".build", "debug", "SketchCLI");
  if (existsSync(debugPath)) return debugPath;

  return null;
}

function getCliPath(): string {
  const path = findSketchCli();
  if (!path) {
    const releasePath = join(__dirname, "..", "..", "..", "sketch-cli", ".build", "release", "SketchCLI");
    const debugPath = join(__dirname, "..", "..", "..", "sketch-cli", ".build", "debug", "SketchCLI");
    throw new Error(
      `SketchCLI not found.\n\n` +
      `Searched:\n  - ${releasePath}\n  - ${debugPath}\n\n` +
      `Build it: cd sketch-cli && swift build -c release`
    );
  }
  return path;
}

let cliPath: string | null = null;

export class SwiftSketchProvider implements SketchProvider {
  private async runCli<T>(command: string, args?: object): Promise<T> {
    if (!cliPath) cliPath = getCliPath();

    const cliArgs = args ? [command, JSON.stringify(args)] : [command];

    let stdout: string;
    try {
      const result = await execFileAsync(cliPath, cliArgs);
      stdout = result.stdout;
    } catch (err: unknown) {
      const e = err as { code?: string | number; signal?: string; stderr?: string; message?: string };
      if (e.code === "ENOENT") {
        throw new Error(`SketchCLI not found at: ${cliPath}`);
      }
      if (typeof e.code === "number") {
        const stderr = e.stderr?.trim();
        throw new Error(`SketchCLI '${command}' exited with code ${e.code}${stderr ? `: ${stderr}` : ""}`);
      }
      if (e.signal) {
        throw new Error(`SketchCLI '${command}' killed by signal ${e.signal}`);
      }
      throw new Error(`SketchCLI '${command}' failed: ${e.message ?? String(err)}`);
    }

    try {
      return JSON.parse(stdout.trim()) as T;
    } catch {
      throw new Error(`SketchCLI '${command}' returned invalid JSON: ${stdout.slice(0, 200)}`);
    }
  }

  async propose(opts: ProposeOptions): Promise<LayoutResult> {
    return this.runCli<LayoutResult>("propose", opts);
  }

  async describe(opts: DescribeOptions): Promise<DescribeResult> {
    return this.runCli<DescribeResult>("describe", opts);
  }

  async templates(): Promise<TemplatesResult> {
    return this.runCli<TemplatesResult>("templates");
  }
}
