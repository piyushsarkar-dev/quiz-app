import questionsData from "@/data/questions.json"

export interface Question {
  id: number
  category: string
  question: string
  options: string[]
  correctIndex: number
}

export function getQuestions(): Question[] {
  return questionsData as Question[]
}

export function calculateScore(answers: Record<number, number>): {
  correct: number
  total: number
  percentage: number
} {
  const questions = getQuestions()
  let correct = 0

  questions.forEach((q) => {
    if (answers[q.id] === q.correctIndex) {
      correct++
    }
  })

  return {
    correct,
    total: questions.length,
    percentage: Math.round((correct / questions.length) * 100),
  }
}
