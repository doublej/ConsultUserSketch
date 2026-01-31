import SwiftUI

struct BlockView: View {
    @Binding var block: GridBlock
    let cellWidth: CGFloat
    let cellHeight: CGFloat
    let gridColumns: Int
    let gridRows: Int
    var interactive: Bool = true
    var isNested: Bool = false
    var onDelete: (() -> Void)?
    var onRename: ((String) -> Void)?

    @State private var isDragging = false
    @State private var dragOffset: CGSize = .zero
    @State private var isResizing = false
    @State private var resizeDelta: CGSize = .zero
    @State private var isEditing = false
    @State private var editText = ""

    private var blockColor: Color {
        ColorPalette.swiftUIColor(from: block.color ?? "#3B82F6")
    }

    private var currentW: CGFloat {
        let base = CGFloat(block.w) * cellWidth
        return isResizing ? max(cellWidth, base + resizeDelta.width) : base
    }

    private var currentH: CGFloat {
        let base = CGFloat(block.h) * cellHeight
        return isResizing ? max(cellHeight, base + resizeDelta.height) : base
    }

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 6)
                .fill(blockColor.opacity(isDragging ? 0.5 : (isNested ? 0.35 : 0.25)))
            RoundedRectangle(cornerRadius: 6)
                .strokeBorder(blockColor, style: StrokeStyle(
                    lineWidth: isDragging ? 3 : 2,
                    dash: isNested ? [4, 3] : []
                ))

            if isEditing {
                TextField("Label", text: $editText, onCommit: {
                    onRename?(editText)
                    isEditing = false
                })
                .textFieldStyle(.plain)
                .font(.system(size: 12, weight: .semibold))
                .multilineTextAlignment(.center)
                .padding(6)
            } else {
                Text(block.label)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.primary)
                    .lineLimit(2)
                    .minimumScaleFactor(0.5)
            }

            if interactive {
                VStack {
                    Spacer()
                    HStack {
                        Spacer()
                        resizeHandle
                    }
                }
            }
        }
        .frame(width: currentW - (isNested ? 6 : 2), height: currentH - (isNested ? 6 : 2))
        .offset(isDragging ? dragOffset : .zero)
        .contentShape(Rectangle())
        .onTapGesture(count: 2) {
            guard interactive else { return }
            editText = block.label
            isEditing = true
        }
        .gesture(interactive ? dragGesture : nil)
        .contextMenu {
            if interactive {
                Button(role: .destructive) {
                    onDelete?()
                } label: {
                    Label("Delete", systemImage: "trash")
                }
            }
        }
    }

    private var resizeHandle: some View {
        Image(systemName: "arrow.down.right")
            .font(.system(size: 9, weight: .bold))
            .foregroundColor(blockColor.opacity(0.6))
            .frame(width: 18, height: 18)
            .contentShape(Rectangle())
            .gesture(resizeGesture)
    }

    private var dragGesture: some Gesture {
        DragGesture(minimumDistance: 4)
            .onChanged { value in
                isDragging = true
                dragOffset = value.translation
            }
            .onEnded { value in
                isDragging = false
                let colDelta = Int(round(value.translation.width / cellWidth))
                let rowDelta = Int(round(value.translation.height / cellHeight))
                block.x = max(0, min(gridColumns - block.w, block.x + colDelta))
                block.y = max(0, min(gridRows - block.h, block.y + rowDelta))
                dragOffset = .zero
            }
    }

    private var resizeGesture: some Gesture {
        DragGesture(minimumDistance: 2)
            .onChanged { value in
                isResizing = true
                resizeDelta = value.translation
            }
            .onEnded { value in
                isResizing = false
                let colDelta = Int(round(value.translation.width / cellWidth))
                let rowDelta = Int(round(value.translation.height / cellHeight))
                block.w = max(1, min(gridColumns - block.x, block.w + colDelta))
                block.h = max(1, min(gridRows - block.y, block.h + rowDelta))
                resizeDelta = .zero
            }
    }
}
