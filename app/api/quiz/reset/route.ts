import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getSession } from "@/lib/session"

export async function POST() {
  try {
    const session = await getSession()

    if (!session?.isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.delete("quiz_result")

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
