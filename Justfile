# Sketch CLI test cases
# Usage: just testcase-1, just testcase-2, etc.

cli := "sketch-cli/.build/debug/SketchCLI"

# Build Swift CLI (debug)
build:
    cd sketch-cli && swift build

# Build Swift CLI (release)
build-release:
    cd sketch-cli && swift build -c release

# TC1: Editor dialog self-portrait — current layout of the sketch editor
testcase-1: build
    {{cli}} propose '{"width":14,"height":10,"title":"Sketch MCP Editor Dialog","description":"Current layout of the interactive grid editor window (700x500px)","structure":{"id":"root","layout":{"direction":"column"},"children":[{"id":"title-bar","layout":{"direction":"row"},"role":"header","label":"Title Bar","constraints":{"height":1},"children":[{"id":"Title + Description","constraints":{"width":"fill"}},{"id":"Grid Size Badge","constraints":{"width":3}}]},{"id":"main-content","layout":{"direction":"row"},"children":[{"id":"sidebar","layout":{"direction":"column"},"role":"sidebar","label":"Sidebar","constraints":{"width":2},"children":[{"id":"+ Add Element","role":"panel","constraints":{"height":2}}]},{"id":"Grid Canvas","role":"canvas","constraints":{"width":"fill","height":"fill"}}]},{"id":"bottom-bar","layout":{"direction":"row"},"role":"footer","label":"Action Bar","constraints":{"height":2},"children":[{"id":"Instructions","constraints":{"width":"fill"}},{"id":"Undo/Redo","constraints":{"width":2}},{"id":"Cancel","constraints":{"width":2}},{"id":"Accept","constraints":{"width":2}}]}]}}'

# TC2: Simple dashboard with sidebar, header, content
testcase-2: build
    {{cli}} propose '{"template":"standard","title":"Dashboard","structure":{"id":"root","layout":{"direction":"column"},"children":[{"id":"Header","role":"header","constraints":{"height":2}},{"id":"body","layout":{"direction":"row"},"children":[{"id":"Sidebar","role":"sidebar","constraints":{"width":3}},{"id":"Main Content","role":"canvas","constraints":{"width":"fill"}}]}]}}'

# TC3: Mobile layout
testcase-3: build
    {{cli}} propose '{"template":"mobile","title":"Mobile App","structure":{"id":"root","layout":{"direction":"column"},"children":[{"id":"Status Bar","role":"header","constraints":{"height":1}},{"id":"Nav Bar","role":"toolbar","constraints":{"height":1}},{"id":"Content","role":"canvas","constraints":{"height":"fill"}},{"id":"Tab Bar","role":"footer","constraints":{"height":1}}]}}'

# TC4: Grid blocks (manual coordinates)
testcase-4: build
    {{cli}} propose '{"width":12,"height":8,"title":"Blog Layout","blocks":[{"label":"Header","x":0,"y":0,"w":12,"h":2},{"label":"Featured","x":0,"y":2,"w":8,"h":3},{"label":"Sidebar","x":8,"y":2,"w":4,"h":6},{"label":"Article 1","x":0,"y":5,"w":4,"h":3},{"label":"Article 2","x":4,"y":5,"w":4,"h":3}]}'

# TC5: Complex dashboard with nested panels
testcase-5: build
    {{cli}} propose '{"template":"detailed","title":"Analytics Dashboard","structure":{"id":"root","layout":{"direction":"column"},"children":[{"id":"Top Bar","role":"header","constraints":{"height":2}},{"id":"body","layout":{"direction":"row"},"children":[{"id":"Nav","role":"sidebar","constraints":{"width":3}},{"id":"content","layout":{"direction":"column"},"children":[{"id":"metrics","layout":{"direction":"row"},"children":[{"id":"Revenue","role":"panel","constraints":{"width":"fill"}},{"id":"Users","role":"panel","constraints":{"width":"fill"}},{"id":"Orders","role":"panel","constraints":{"width":"fill"}}]},{"id":"charts","layout":{"direction":"row"},"children":[{"id":"Line Chart","role":"canvas","constraints":{"width":"fill","height":"fill"}},{"id":"Pie Chart","role":"panel","constraints":{"width":5}}]},{"id":"Data Table","role":"panel","constraints":{"height":4}}]}]}]}}'

# TC6: Empty canvas
testcase-6: build
    {{cli}} propose '{"template":"standard","title":"Blank Canvas","description":"Start from scratch"}'

# Describe layout (non-interactive)
describe-1:
    {{cli}} describe '{"columns":12,"rows":8,"blocks":[{"label":"Header","x":0,"y":0,"w":12,"h":2},{"label":"Content","x":0,"y":2,"w":8,"h":6},{"label":"Sidebar","x":8,"y":2,"w":4,"h":6}]}'

# List templates
templates:
    {{cli}} templates

# Run visual test suite
test: build
    {{cli}} test --output /tmp/sketch-test-report
