import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { LoginForm } from "@/components/login-form"

export default async function LoginPage() {
  const session = await getSession()

  if (!session?.name) {
    redirect("/")
  }

  if (session.isAuthed) {
    redirect("/quiz")
  }

  return <LoginForm name={session.name} />
}
