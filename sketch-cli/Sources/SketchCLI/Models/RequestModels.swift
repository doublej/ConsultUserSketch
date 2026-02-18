import Foundation

struct BlockInput: Codable {
    let label: String
    let x: Int
    let y: Int
    let w: Int
    let h: Int
    let color: String?
}

struct NestedLayout: Codable {
    let columns: Int?
    let rows: Int?
    let blocks: [BlockInput]?
}

struct ProposeLayoutRequest: Codable {
    let width: Int?
    let height: Int?
    let template: String?
    let title: String?
    let description: String?
    let blocks: [BlockInput]?
    let layout: NestedLayout?
    let theme: String?

    func resolvedLayout() -> GridLayout {
        var cols = layout?.columns ?? width ?? 12
        var rows = layout?.rows ?? height ?? 8

        if let templateName = template,
           let tmpl = DensityTemplate.builtIn.first(where: { $0.name == templateName }) {
            cols = tmpl.width
            rows = tmpl.height
        }

        cols = max(3, min(20, cols))
        rows = max(3, min(20, rows))

        let inputBlocks = layout?.blocks ?? blocks ?? []
        let gridBlocks = inputBlocks.map { input in
            GridBlock(
                label: input.label,
                x: input.x, y: input.y,
                w: input.w, h: input.h,
                color: input.color
            )
        }

        return GridLayout(columns: cols, rows: rows, blocks: gridBlocks)
    }
}

struct DescribeRequest: Codable {
    let columns: Int
    let rows: Int
    let blocks: [BlockInput]
    let detail: String?
}
