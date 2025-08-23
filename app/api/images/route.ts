import { NextResponse } from "next/server"
import { readdir, stat } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET() {
  try {
    const uploadDir = join(process.cwd(), "public", "uploads")

    if (!existsSync(uploadDir)) {
      return NextResponse.json({ images: [] })
    }

    const files = await readdir(uploadDir)
    const imageFiles = files.filter((file) => {
      const ext = file.toLowerCase().split(".").pop()
      return ["jpg", "jpeg", "png", "webp", "gif"].includes(ext || "")
    })

    const images = await Promise.all(
      imageFiles.map(async (filename) => {
        const filepath = join(uploadDir, filename)
        const stats = await stat(filepath)

        // Extract file info from filename (timestamp-random.ext)
        const parts = filename.split("-")
        const timestamp = parts[0] ? Number.parseInt(parts[0]) : Date.now()

        return {
          url: `/uploads/${filename}`,
          filename,
          size: stats.size,
          type: `image/${filename.split(".").pop()}`,
          uploadedAt: new Date(timestamp),
        }
      }),
    )

    // Sort by upload date (newest first)
    images.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Failed to load images:", error)
    return NextResponse.json({ error: "Failed to load images" }, { status: 500 })
  }
}
