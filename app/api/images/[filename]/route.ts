import { type NextRequest, NextResponse } from "next/server"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function DELETE(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const { filename } = params

    if (!filename) {
      return NextResponse.json({ error: "Filename required" }, { status: 400 })
    }

    const filepath = join(process.cwd(), "public", "uploads", filename)

    if (!existsSync(filepath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    await unlink(filepath)

    return NextResponse.json({ success: true, message: "File deleted successfully" })
  } catch (error) {
    console.error("Failed to delete file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
