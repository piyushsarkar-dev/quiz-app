import { QuizClient } from "@/components/quiz-client";
import { getQuestions } from "@/lib/questions";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

function shuffleArray<T>(input: T[]): T[] {
	const array = [...input];
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

export default async function QuizPage() {
	const session = await getSession();

	if (!session?.name) {
		redirect("/");
	}

	if (!session.isAuthed) {
		redirect("/login");
	}

	const randomizedQuestions = shuffleArray(getQuestions()).map((question) => {
		const optionPairs = question.options.map((option, index) => ({
			option,
			index,
		}));
		const shuffledOptions = shuffleArray(optionPairs);

		return {
			id: question.id,
			category: question.category,
			question: question.question,
			options: shuffledOptions.map(({ option }) => option),
			optionOrder: shuffledOptions.map(({ index }) => index),
		};
	});

	return (
		<QuizClient
			questions={randomizedQuestions}
			userName={session.name}
		/>
	);
}
