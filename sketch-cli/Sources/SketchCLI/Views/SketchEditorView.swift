import SwiftUI

class SketchEditorState: ObservableObject {
    @Published var layout: GridLayout
    let initialLayout: GridLayout
    var status: String = "cancelled"

    init(layout: GridLayout) {
        self.layout = layout
        self.initialLayout = layout
    }
}

struct SketchEditorView: View {
    @ObservedObject var state: SketchEditorState
    let titleText: String
    let descriptionText: String?

    @State private var showAddSheet = false
    @State private var addBlockCol = 0
    @State private var addBlockRow = 0

    var body: some View {
        VStack(spacing: 0) {
            titleBar
                .padding(.horizontal, 16)
                .padding(.top, 16)
                .padding(.bottom, 8)

            GridCanvasView(
                layout: $state.layout,
                interactive: true,
                onAddBlock: { col, row in
                    addBlockCol = col
                    addBlockRow = row
                    showAddSheet = true
                }
            )
            .padding(.horizontal, 16)
            .clipShape(RoundedRectangle(cornerRadius: 8))

            buttonBar
                .padding(16)
        }
        .background(Color(nsColor: .windowBackgroundColor))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .sheet(isPresented: $showAddSheet) {
            AddBlockSheet(
                col: addBlockCol,
                row: addBlockRow,
                onAdd: { label in
                    let newBlock = GridBlock(
                        label: label,
                        x: addBlockCol, y: addBlockRow,
                        w: 1, h: 1,
                        color: ColorPalette.colors[state.layout.blocks.count % ColorPalette.colors.count]
                    )
                    state.layout.blocks.append(newBlock)
                }
            )
        }
    }

    private var titleBar: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(titleText)
                    .font(.headline)
                if let desc = descriptionText {
                    Text(desc)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            Spacer()
            Text("\(state.layout.columns)\u{00D7}\(state.layout.rows)")
                .font(.caption)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Color.secondary.opacity(0.15))
                .clipShape(Capsule())
        }
        .background(WindowDragArea())
    }

    private var buttonBar: some View {
        HStack {
            Spacer()
            Button("Cancel") {
                state.status = "cancelled"
                NSApp.stopModal()
            }
            .keyboardShortcut(.cancelAction)

            Button("Accept") {
                state.status = state.layout == state.initialLayout ? "accepted" : "modified"
                NSApp.stopModal()
            }
            .keyboardShortcut(.defaultAction)
            .buttonStyle(.borderedProminent)
        }
    }
}
