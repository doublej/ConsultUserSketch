export interface BlockInput {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
}

export interface GridLayout {
  columns: number;
  rows: number;
  blocks: BlockInput[];
}

export interface ProposeOptions {
  width?: number;
  height?: number;
  template?: string;
  title?: string;
  description?: string;
  blocks?: BlockInput[];
}

export interface LayoutResult {
  status: "accepted" | "modified" | "cancelled";
  layout: GridLayout | null;
  ascii: string | null;
  image: string | null;
  summary: string | null;
  changes: string[] | null;
}

export interface DescribeOptions {
  columns: number;
  rows: number;
  blocks: BlockInput[];
  detail?: "brief" | "full";
}

export interface DescribeResult {
  summary: string;
  ascii: string;
}

export interface TemplatesResult {
  templates: DensityTemplate[];
}

export interface DensityTemplate {
  name: string;
  width: number;
  height: number;
  density: string;
  description: string;
  maxBlocks: number;
}
