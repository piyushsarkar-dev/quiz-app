import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || "quiz-app-secret-key-change-in-production-2024",
)

export interface SessionData {
  name: string
  isAuthed: boolean
}

export async function createSession(data: SessionData): Promise<string> {
  const token = await new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET_KEY)

  return token
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return {
      name: payload.name as string,
      isAuthed: payload.isAuthed as boolean,
    }
  } catch {
    return null
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
