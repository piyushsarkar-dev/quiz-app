import { NextResponse } from "next/server"
import { clearSession } from "@/lib/session"
import { cookies } from "next/headers"

export async function POST() {
  try {
    await clearSession()
    const cookieStore = await cookies()
    cookieStore.delete("quiz_result")

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
