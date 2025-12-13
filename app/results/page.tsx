import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getSession } from "@/lib/session"
import { getQuestions } from "@/lib/questions"
import { ResultsClient } from "@/components/results-client"

export default async function ResultsPage() {
  const session = await getSession()

  if (!session?.name) {
    redirect("/")
  }

  if (!session.isAuthed) {
    redirect("/login")
  }

  const cookieStore = await cookies()
  const resultCookie = cookieStore.get("quiz_result")?.value

  if (!resultCookie) {
    redirect("/quiz")
  }

  const result = JSON.parse(resultCookie)
  const questions = getQuestions()

  return (
    <ResultsClient
      userName={session.name}
      correct={result.correct}
      total={result.total}
      percentage={result.percentage}
      answers={result.answers}
      questions={questions}
    />
  )
}
