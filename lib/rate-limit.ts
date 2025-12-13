// In-memory rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; resetTime: number }>()

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (!record || now > record.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + WINDOW_MS })
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: WINDOW_MS }
  }

  if (record.count >= MAX_ATTEMPTS) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: record.resetTime - now,
    }
  }

  record.count++
  return {
    allowed: true,
    remaining: MAX_ATTEMPTS - record.count,
    resetIn: record.resetTime - now,
  }
}

export function resetRateLimit(ip: string) {
  loginAttempts.delete(ip)
}
