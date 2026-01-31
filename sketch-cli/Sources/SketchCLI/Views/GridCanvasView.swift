import SwiftUI

struct GridCanvasView: View {
    @Binding var layout: GridLayout
    var interactive: Bool = true
    var onAddBlock: ((Int, Int) -> Void)?

    private var nesting: [String: String] {
        DescriptionRenderer.detectNesting(layout.blocks)
    }

    var body: some View {
        GeometryReader { geo in
            let cellW = geo.size.width / CGFloat(layout.columns)
            let cellH = geo.size.height / CGFloat(layout.rows)
            let nestingMap = nesting

            ZStack(alignment: .topLeading) {
                // Grid background + click-to-add
                gridBackground(cellW: cellW, cellH: cellH, size: geo.size)

                // Blocks positioned via offset from top-left
                // Render parent blocks first, then nested blocks on top
                ForEach(sortedBlocks(nestingMap)) { block in
                    let blockBinding = binding(for: block)
                    let isNested = nestingMap[block.id] != nil
                    BlockView(
                        block: blockBinding,
                        cellWidth: cellW,
                        cellHeight: cellH,
                        gridColumns: layout.columns,
                        gridRows: layout.rows,
                        interactive: interactive,
                        isNested: isNested,
                        onDelete: { deleteBlock(id: block.id) },
                        onRename: { newLabel in renameBlock(id: block.id, label: newLabel) }
                    )
                    .offset(
                        x: CGFloat(block.x) * cellW + (isNested ? 3 : 1),
                        y: CGFloat(block.y) * cellH + (isNested ? 3 : 1)
                    )
                }
            }
            .coordinateSpace(name: "canvas")
        }
    }

    /// Sort blocks: parents first, nested children after their parents
    private func sortedBlocks(_ nestingMap: [String: String]) -> [GridBlock] {
        let parents = layout.blocks.filter { nestingMap[$0.id] == nil }
        let children = layout.blocks.filter { nestingMap[$0.id] != nil }
        return parents + children
    }

    private func gridBackground(cellW: CGFloat, cellH: CGFloat, size: CGSize) -> some View {
        Canvas { context, canvasSize in
            let lineColor = Color.gray.opacity(0.15)
            for col in 0 ... layout.columns {
                let x = CGFloat(col) * cellW
                var path = Path()
                path.move(to: CGPoint(x: x, y: 0))
                path.addLine(to: CGPoint(x: x, y: canvasSize.height))
                context.stroke(path, with: .color(lineColor), lineWidth: 0.5)
            }
            for row in 0 ... layout.rows {
                let y = CGFloat(row) * cellH
                var path = Path()
                path.move(to: CGPoint(x: 0, y: y))
                path.addLine(to: CGPoint(x: canvasSize.width, y: y))
                context.stroke(path, with: .color(lineColor), lineWidth: 0.5)
            }
        }
        .contentShape(Rectangle())
        .onTapGesture { location in
            guard interactive else { return }
            let col = Int(location.x / cellW)
            let row = Int(location.y / cellH)
            guard col >= 0, col < layout.columns, row >= 0, row < layout.rows else { return }
            let occupied = layout.blocks.contains { b in
                col >= b.x && col < b.x + b.w && row >= b.y && row < b.y + b.h
            }
            if !occupied {
                onAddBlock?(col, row)
            }
        }
    }

    private func binding(for block: GridBlock) -> Binding<GridBlock> {
        Binding(
            get: { layout.blocks.first(where: { $0.id == block.id }) ?? block },
            set: { newValue in
                if let idx = layout.blocks.firstIndex(where: { $0.id == block.id }) {
                    layout.blocks[idx] = newValue
                }
            }
        )
    }

    private func deleteBlock(id: String) {
        layout.blocks.removeAll { $0.id == id }
    }

    private func renameBlock(id: String, label: String) {
        if let idx = layout.blocks.firstIndex(where: { $0.id == id }) {
            layout.blocks[idx].label = label
        }
    }
}
