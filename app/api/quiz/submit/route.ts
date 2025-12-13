import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { calculateScore } from "@/lib/questions"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session?.isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { answers } = await request.json()

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "Invalid answers" }, { status: 400 })
    }

    const result = calculateScore(answers)

    // Store result in a cookie for the results page
    const cookieStore = await cookies()
    cookieStore.set(
      "quiz_result",
      JSON.stringify({
        ...result,
        answers,
        submittedAt: Date.now(),
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      },
    )

    return NextResponse.json({ success: true, result })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
