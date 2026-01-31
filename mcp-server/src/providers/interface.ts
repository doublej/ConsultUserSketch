import type {
  ProposeOptions,
  LayoutResult,
  DescribeOptions,
  DescribeResult,
  TemplatesResult,
} from "../types.js";

export interface SketchProvider {
  propose(opts: ProposeOptions): Promise<LayoutResult>;
  describe(opts: DescribeOptions): Promise<DescribeResult>;
  templates(): Promise<TemplatesResult>;
}
