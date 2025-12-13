import { type NextRequest, NextResponse } from "next/server"
import { getSession, createSession, setSessionCookie } from "@/lib/session"
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit"

const CORRECT_PASSWORD = "80808"

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || "unknown"

    // Check rate limit
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "অনেক বেশি চেষ্টা করেছেন। কিছুক্ষণ পর আবার চেষ্টা করুন।",
          resetIn: rateLimit.resetIn,
        },
        { status: 429 },
      )
    }

    const session = await getSession()
    if (!session?.name) {
      return NextResponse.json({ error: "Session not found" }, { status: 401 })
    }

    const { password } = await request.json()

    if (password !== CORRECT_PASSWORD) {
      return NextResponse.json(
        {
          error: "ভুল পাসওয়ার্ড",
          remaining: rateLimit.remaining,
          resetIn: rateLimit.resetIn,
        },
        { status: 401 },
      )
    }

    // Reset rate limit on successful login
    resetRateLimit(ip)

    // Update session with isAuthed = true
    const token = await createSession({ name: session.name, isAuthed: true })
    await setSessionCookie(token)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
