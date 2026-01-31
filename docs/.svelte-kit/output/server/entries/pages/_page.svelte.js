import { w as head, x as ensure_array_like, y as attr_style, z as stringify } from "../../chunks/index.js";
import "@sveltejs/kit/internal/server";
import { l as escape_html } from "../../chunks/context.js";
function _page($$renderer) {
  const features = [
    {
      title: "Interactive Grid Editor",
      description: "Drag, resize, and rename blocks in a native macOS SwiftUI dialog. Accept, modify, or cancel layouts interactively."
    },
    {
      title: "MCP Integration",
      description: "Expose layout design as MCP tools for Claude and other LLMs. Propose layouts, get templates, and describe designs programmatically."
    },
    {
      title: "Multi-Format Rendering",
      description: "Output layouts as ASCII art, SVG visualizations, or human-readable text descriptions with spatial relationships."
    },
    {
      title: "Layout Templates",
      description: "Five built-in density presets: compact, standard, spacious, detailed, and mobile. Configurable grids from 3x3 to 20x20."
    },
    {
      title: "Smart Descriptions",
      description: "Auto-generated natural language descriptions with spatial positioning, nesting detection, and grid coordinate mapping."
    },
    {
      title: "Native macOS UI",
      description: "Floating borderless dialog window with drag-to-move, corner resize handles, double-click rename, and context menus."
    }
  ];
  const steps = [
    {
      title: "Build the project",
      description: "Clone the repo and build both the Swift CLI and TypeScript MCP server.",
      code: "git clone https://github.com/doublej/ConsultUserSketch.git\ncd ConsultUserSketch\nnpm run build"
    },
    {
      title: "Configure as MCP server",
      description: "Add ConsultUserSketch to your Claude MCP configuration to enable layout design tools.",
      code: '{\n  "mcpServers": {\n    "consult-user-sketch": {\n      "command": "node",\n      "args": ["mcp-server/dist/index.js"]\n    }\n  }\n}'
    },
    {
      title: "Propose a layout",
      description: "Ask Claude to design a UI layout. It will open an interactive editor where you can drag, resize, and arrange blocks on a grid.",
      code: null
    }
  ];
  head("1uha8ag", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>ConsultUserSketch - Interactive Layout Sketching for LLMs</title>`);
    });
  });
  $$renderer.push(`<main><section class="hero svelte-1uha8ag"><div class="container svelte-1uha8ag"><h1 class="svelte-1uha8ag">ConsultUserSketch</h1> <p class="description svelte-1uha8ag">Interactive UI layout sketching tool for LLM-assisted design workflows.
				Propose grid-based layouts, edit them in a native macOS dialog, and get back
				ASCII, SVG, and text descriptions.</p></div></section> <section class="install svelte-1uha8ag"><div class="container svelte-1uha8ag"><div class="install-box svelte-1uha8ag"><code class="svelte-1uha8ag">npm run build</code> <button class="svelte-1uha8ag">${escape_html("Copy")}</button></div></div></section> <section class="features svelte-1uha8ag"><div class="container svelte-1uha8ag"><h2 class="svelte-1uha8ag">Features</h2> <div class="grid svelte-1uha8ag"><!--[-->`);
  const each_array = ensure_array_like(features);
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let feature = each_array[i];
    $$renderer.push(`<div class="feature-card svelte-1uha8ag"${attr_style(`animation-delay: ${stringify(i * 200)}ms`)}><h3 class="svelte-1uha8ag">${escape_html(feature.title)}</h3> <p class="svelte-1uha8ag">${escape_html(feature.description)}</p></div>`);
  }
  $$renderer.push(`<!--]--></div></div></section> <section class="architecture svelte-1uha8ag"><div class="container svelte-1uha8ag"><h2 class="svelte-1uha8ag">How It Works</h2> <div class="flow svelte-1uha8ag"><div class="flow-step svelte-1uha8ag" style="animation-delay: 0ms"><div class="flow-label svelte-1uha8ag">MCP Client</div> <div class="flow-detail svelte-1uha8ag">Claude or other LLM</div></div> <div class="flow-arrow svelte-1uha8ag">→</div> <div class="flow-step svelte-1uha8ag" style="animation-delay: 200ms"><div class="flow-label svelte-1uha8ag">MCP Server</div> <div class="flow-detail svelte-1uha8ag">TypeScript / Node.js</div></div> <div class="flow-arrow svelte-1uha8ag">→</div> <div class="flow-step svelte-1uha8ag" style="animation-delay: 400ms"><div class="flow-label svelte-1uha8ag">SketchCLI</div> <div class="flow-detail svelte-1uha8ag">Swift executable</div></div> <div class="flow-arrow svelte-1uha8ag">→</div> <div class="flow-step svelte-1uha8ag" style="animation-delay: 600ms"><div class="flow-label svelte-1uha8ag">SwiftUI Editor</div> <div class="flow-detail svelte-1uha8ag">Interactive dialog</div></div></div></div></section> <section class="getting-started svelte-1uha8ag"><div class="container svelte-1uha8ag"><h2 class="svelte-1uha8ag">Getting Started</h2> <div class="steps svelte-1uha8ag"><!--[-->`);
  const each_array_1 = ensure_array_like(steps);
  for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
    let step = each_array_1[i];
    $$renderer.push(`<div class="step svelte-1uha8ag"${attr_style(`animation-delay: ${stringify((i + 3) * 200)}ms`)}><div class="step-number svelte-1uha8ag">${escape_html(i + 1)}</div> <div class="step-content svelte-1uha8ag"><h3 class="svelte-1uha8ag">${escape_html(step.title)}</h3> <p class="svelte-1uha8ag">${escape_html(step.description)}</p> `);
    if (step.code) {
      $$renderer.push("<!--[-->");
      $$renderer.push(`<pre class="svelte-1uha8ag"><code>${escape_html(step.code)}</code></pre>`);
    } else {
      $$renderer.push("<!--[!-->");
    }
    $$renderer.push(`<!--]--></div></div>`);
  }
  $$renderer.push(`<!--]--></div></div></section> <section class="tools svelte-1uha8ag"><div class="container svelte-1uha8ag"><h2 class="svelte-1uha8ag">MCP Tools</h2> <div class="grid tools-grid svelte-1uha8ag"><div class="tool-card svelte-1uha8ag" style="animation-delay: 0ms"><h3 class="svelte-1uha8ag"><code class="svelte-1uha8ag">propose_layout</code></h3> <p class="svelte-1uha8ag">Open an interactive editor with initial blocks. User drags, resizes, and arranges. Returns final layout with ASCII, SVG, and summary.</p></div> <div class="tool-card svelte-1uha8ag" style="animation-delay: 200ms"><h3 class="svelte-1uha8ag"><code class="svelte-1uha8ag">get_layout_templates</code></h3> <p class="svelte-1uha8ag">Get the five built-in density templates with grid dimensions, max blocks, and descriptions for planning layouts.</p></div> <div class="tool-card svelte-1uha8ag" style="animation-delay: 400ms"><h3 class="svelte-1uha8ag"><code class="svelte-1uha8ag">describe_layout</code></h3> <p class="svelte-1uha8ag">Non-interactive analysis of a layout. Returns human-readable spatial descriptions and ASCII art without opening a dialog.</p></div></div></div></section></main> <footer class="svelte-1uha8ag"><div class="container svelte-1uha8ag"><p class="svelte-1uha8ag"><a href="https://github.com/doublej/ConsultUserSketch" target="_blank" rel="noopener" class="svelte-1uha8ag">GitHub</a> · MIT License</p></div></footer>`);
}
export {
  _page as default
};
