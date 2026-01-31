import SwiftUI

enum PngRenderer {
    @MainActor
    static func render(_ layout: GridLayout) -> String? {
        let canvas = GridCanvasView(layout: .constant(layout), interactive: false)
            .frame(width: 800, height: 600)

        let renderer = ImageRenderer(content: canvas)
        renderer.scale = 2.0

        guard let image = renderer.cgImage else { return nil }

        let bitmapRep = NSBitmapImageRep(cgImage: image)
        guard let pngData = bitmapRep.representation(using: .png, properties: [:]) else { return nil }

        return pngData.base64EncodedString()
    }
}
