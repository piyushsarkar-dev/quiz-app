import { type NextRequest, NextResponse } from "next/server"
import { createSession, setSessionCookie } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const sanitizedName = name.replace(/[<>'"&]/g, "").trim()

    if (sanitizedName.length === 0 || sanitizedName.length > 40) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 })
    }

    const token = await createSession({ name: sanitizedName, isAuthed: false })
    await setSessionCookie(token)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
