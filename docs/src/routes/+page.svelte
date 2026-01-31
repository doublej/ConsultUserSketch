<script lang="ts">
	import { base } from '$app/paths';

	const features = [
		{
			title: 'Interactive Grid Editor',
			description: 'Drag, resize, and rename blocks in a native macOS SwiftUI dialog. Accept, modify, or cancel layouts interactively.'
		},
		{
			title: 'MCP Integration',
			description: 'Expose layout design as MCP tools for Claude and other LLMs. Propose layouts, get templates, and describe designs programmatically.'
		},
		{
			title: 'Multi-Format Rendering',
			description: 'Output layouts as ASCII art, SVG visualizations, or human-readable text descriptions with spatial relationships.'
		},
		{
			title: 'Layout Templates',
			description: 'Five built-in density presets: compact, standard, spacious, detailed, and mobile. Configurable grids from 3x3 to 20x20.'
		},
		{
			title: 'Smart Descriptions',
			description: 'Auto-generated natural language descriptions with spatial positioning, nesting detection, and grid coordinate mapping.'
		},
		{
			title: 'Native macOS UI',
			description: 'Floating borderless dialog window with drag-to-move, corner resize handles, double-click rename, and context menus.'
		}
	];

	const steps = [
		{
			title: 'Run the installer',
			description: 'The installer checks prerequisites, clones the repo, and builds everything.',
			code: 'curl -sSL https://raw.githubusercontent.com/doublej/ConsultUserSketch/main/install.sh | bash'
		},
		{
			title: 'Configure as MCP server',
			description: 'Add ConsultUserSketch to your Claude MCP configuration. The installer prints the exact path for your system.',
			code: '{\n  "mcpServers": {\n    "consult-user-sketch": {\n      "command": "node",\n      "args": [\n        "~/.local/share/consult-user-sketch/mcp-server/dist/index.js"\n      ]\n    }\n  }\n}'
		},
		{
			title: 'Propose a layout',
			description: 'Ask Claude to design a UI layout. It will open an interactive editor where you can drag, resize, and arrange blocks on a grid.',
			code: null
		}
	];

	let copied = $state(false);
	const installCommand = 'curl -sSL https://raw.githubusercontent.com/doublej/ConsultUserSketch/main/install.sh | bash';

	function copyInstall() {
		navigator.clipboard.writeText(installCommand);
		copied = true;
		setTimeout(() => copied = false, 2000);
	}
</script>

<svelte:head>
	<title>ConsultUserSketch - Interactive Layout Sketching for LLMs</title>
</svelte:head>

<main>
	<section class="hero">
		<div class="container">
			<h1>ConsultUserSketch</h1>
			<p class="description">
				Interactive UI layout sketching tool for LLM-assisted design workflows.
				Propose grid-based layouts, edit them in a native macOS dialog, and get back
				ASCII, SVG, and text descriptions.
			</p>
		</div>
	</section>

	<section class="install">
		<div class="container">
			<div class="install-box">
				<code>curl -sSL .../install.sh | bash</code>
				<button onclick={copyInstall}>{copied ? 'Copied!' : 'Copy'}</button>
			</div>
		</div>
	</section>

	<section class="features">
		<div class="container">
			<h2>Features</h2>
			<div class="grid">
				{#each features as feature, i}
					<div class="feature-card" style="animation-delay: {i * 200}ms">
						<h3>{feature.title}</h3>
						<p>{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="architecture">
		<div class="container">
			<h2>How It Works</h2>
			<div class="flow">
				<div class="flow-step" style="animation-delay: 0ms">
					<div class="flow-label">MCP Client</div>
					<div class="flow-detail">Claude or other LLM</div>
				</div>
				<div class="flow-arrow">&rarr;</div>
				<div class="flow-step" style="animation-delay: 200ms">
					<div class="flow-label">MCP Server</div>
					<div class="flow-detail">TypeScript / Node.js</div>
				</div>
				<div class="flow-arrow">&rarr;</div>
				<div class="flow-step" style="animation-delay: 400ms">
					<div class="flow-label">SketchCLI</div>
					<div class="flow-detail">Swift executable</div>
				</div>
				<div class="flow-arrow">&rarr;</div>
				<div class="flow-step" style="animation-delay: 600ms">
					<div class="flow-label">SwiftUI Editor</div>
					<div class="flow-detail">Interactive dialog</div>
				</div>
			</div>
		</div>
	</section>

	<section class="getting-started">
		<div class="container">
			<h2>Getting Started</h2>
			<div class="steps">
				{#each steps as step, i}
					<div class="step" style="animation-delay: {(i + 3) * 200}ms">
						<div class="step-number">{i + 1}</div>
						<div class="step-content">
							<h3>{step.title}</h3>
							<p>{step.description}</p>
							{#if step.code}
								<pre><code>{step.code}</code></pre>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="tools">
		<div class="container">
			<h2>MCP Tools</h2>
			<div class="grid tools-grid">
				<div class="tool-card" style="animation-delay: 0ms">
					<h3><code>propose_layout</code></h3>
					<p>Open an interactive editor with initial blocks. User drags, resizes, and arranges. Returns final layout with ASCII, SVG, and summary.</p>
				</div>
				<div class="tool-card" style="animation-delay: 200ms">
					<h3><code>get_layout_templates</code></h3>
					<p>Get the five built-in density templates with grid dimensions, max blocks, and descriptions for planning layouts.</p>
				</div>
				<div class="tool-card" style="animation-delay: 400ms">
					<h3><code>describe_layout</code></h3>
					<p>Non-interactive analysis of a layout. Returns human-readable spatial descriptions and ASCII art without opening a dialog.</p>
				</div>
			</div>
		</div>
	</section>
</main>

<footer>
	<div class="container">
		<p>
			<a href="https://github.com/doublej/ConsultUserSketch" target="_blank" rel="noopener">GitHub</a>
			&middot; MIT License
		</p>
	</div>
</footer>

<style>
	.container {
		max-width: var(--container-max-width);
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	/* Hero */
	.hero {
		padding: 80px var(--container-padding) 40px;
		text-align: center;
		animation: fadeSlideUp 0.5s ease-out forwards;
	}

	h1 {
		font-size: 2.8rem;
		font-weight: 600;
		letter-spacing: -0.03em;
		margin-bottom: 1rem;
	}

	.description {
		font-size: 1.15rem;
		color: var(--text-secondary);
		max-width: 700px;
		margin: 0 auto;
		line-height: 1.7;
	}

	/* Install */
	.install {
		padding: 20px var(--container-padding) var(--section-padding);
		animation: fadeSlideUp 0.5s ease-out 200ms forwards;
		opacity: 0;
	}

	.install-box {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 12px 20px;
		max-width: 500px;
		margin: 0 auto;
	}

	.install-box code {
		font-size: 0.95rem;
		color: var(--text-primary);
	}

	.install-box button {
		font-family: 'Instrument Sans', system-ui, sans-serif;
		font-size: 0.85rem;
		padding: 6px 14px;
		border: 1px solid var(--border);
		border-radius: 6px;
		background: var(--bg-primary);
		color: var(--text-secondary);
		cursor: pointer;
		white-space: nowrap;
		transition: background 0.15s;
	}

	.install-box button:hover {
		background: var(--border);
	}

	/* Sections */
	h2 {
		font-size: 1.6rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin-bottom: 32px;
	}

	.features, .getting-started, .tools, .architecture {
		padding: var(--section-padding) var(--container-padding);
	}

	/* Feature Grid */
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--grid-gap);
	}

	.feature-card, .tool-card {
		background: var(--bg-secondary);
		padding: 24px;
		border: 1px solid var(--border);
		border-radius: 8px;
		animation: fadeSlideUp 0.5s ease-out forwards;
		opacity: 0;
	}

	.feature-card h3, .tool-card h3 {
		font-size: 1.05rem;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.feature-card p, .tool-card p {
		font-size: 0.95rem;
		color: var(--text-secondary);
		line-height: 1.6;
	}

	/* Architecture Flow */
	.flow {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		flex-wrap: wrap;
	}

	.flow-step {
		background: var(--bg-secondary);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 20px 24px;
		text-align: center;
		animation: fadeSlideUp 0.5s ease-out forwards;
		opacity: 0;
	}

	.flow-label {
		font-weight: 600;
		font-size: 1rem;
		margin-bottom: 4px;
	}

	.flow-detail {
		font-size: 0.85rem;
		color: var(--text-tertiary);
	}

	.flow-arrow {
		font-size: 1.4rem;
		color: var(--text-tertiary);
	}

	/* Getting Started Steps */
	.steps {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.step {
		display: flex;
		gap: 20px;
		animation: fadeSlideUp 0.5s ease-out forwards;
		opacity: 0;
	}

	.step-number {
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--accent);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.step-content h3 {
		font-size: 1.05rem;
		font-weight: 600;
		margin-bottom: 6px;
	}

	.step-content p {
		font-size: 0.95rem;
		color: var(--text-secondary);
		margin-bottom: 12px;
	}

	.step-content pre {
		background: var(--bg-code);
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 14px 18px;
		overflow-x: auto;
		font-size: 0.85rem;
		line-height: 1.5;
	}

	/* Tools Grid */
	.tools-grid {
		grid-template-columns: repeat(3, 1fr);
	}

	.tool-card h3 code {
		font-size: 0.95rem;
		background: var(--bg-code);
		padding: 2px 8px;
		border-radius: 4px;
	}

	/* Footer */
	footer {
		padding: 40px var(--container-padding);
		text-align: center;
		border-top: 1px solid var(--border);
		margin-top: 40px;
	}

	footer p {
		font-size: 0.9rem;
		color: var(--text-tertiary);
	}

	footer a {
		color: var(--text-primary);
		text-decoration: none;
		font-weight: 500;
	}

	footer a:hover {
		text-decoration: underline;
	}

	/* Responsive */
	@media (max-width: 1000px) {
		.grid, .tools-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 700px) {
		h1 {
			font-size: 2rem;
		}

		.grid, .tools-grid {
			grid-template-columns: 1fr;
		}

		.flow {
			flex-direction: column;
		}

		.flow-arrow {
			transform: rotate(90deg);
		}

		.hero {
			padding: 60px var(--container-padding) 30px;
		}
	}
</style>
