import AppKit

class BorderlessWindow: NSWindow {
    override var canBecomeKey: Bool { true }
    override var canBecomeMain: Bool { true }
    override var acceptsFirstResponder: Bool { true }

    var onUndoRequested: (() -> Void)?
    var onRedoRequested: (() -> Void)?

    override init(
        contentRect: NSRect,
        styleMask style: NSWindow.StyleMask,
        backing backingStoreType: NSWindow.BackingStoreType,
        defer flag: Bool
    ) {
        super.init(contentRect: contentRect, styleMask: style, backing: backingStoreType, defer: flag)
        self.autorecalculatesKeyViewLoop = true
    }

    override func keyDown(with event: NSEvent) {
        let cmdPressed = event.modifierFlags.contains(.command)
        let shiftPressed = event.modifierFlags.contains(.shift)

        if event.keyCode == 53 { // ESC
            NSApp.stopModal(withCode: .cancel)
        } else if cmdPressed && shiftPressed && event.charactersIgnoringModifiers == "z" {
            onRedoRequested?()
        } else if cmdPressed && event.charactersIgnoringModifiers == "z" {
            onUndoRequested?()
        } else {
            super.keyDown(with: event)
        }
    }

    override func cancelOperation(_ sender: Any?) {
        NSApp.stopModal(withCode: .cancel)
    }
}

class DraggableView: NSView {
    override var mouseDownCanMoveWindow: Bool { false }

    override func draw(_ dirtyRect: NSRect) {
        let rect = bounds.insetBy(dx: 8, dy: 8)
        let path = NSBezierPath(roundedRect: rect, xRadius: 12, yRadius: 12)
        Theme.windowBackground.setFill()
        path.fill()
    }
}
