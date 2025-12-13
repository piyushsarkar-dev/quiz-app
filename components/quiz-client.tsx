"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, FileText, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Question {
	id: number;
	category: string;
	question: string;
	options: string[];
	optionOrder: number[];
}

interface QuizClientProps {
	questions: Question[];
	userName: string;
}

export function QuizClient({ questions, userName }: QuizClientProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState<Record<number, number>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
	useEffect(() => {
		const mediaQuery = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		);
		setPrefersReducedMotion(mediaQuery.matches);
	}, []);

	const currentQuestion = questions[currentIndex];
	const isAnswered = answers[currentQuestion.id] !== undefined;
	const canGoNext = isAnswered && currentIndex < questions.length - 1;
	const canGoPrev = currentIndex > 0;
	const isLastQuestion = currentIndex === questions.length - 1;
	const canSubmit = Object.keys(answers).length === questions.length;

	const handleSelect = (optionIndex: number) => {
		// Only allow selection if not already answered
		if (answers[currentQuestion.id] === undefined) {
			const originalIndex = currentQuestion.optionOrder[optionIndex];
			setAnswers((prev) => ({
				...prev,
				[currentQuestion.id]: originalIndex,
			}));
		}
	};

	const handleNext = useCallback(() => {
		if (canGoNext) {
			setCurrentIndex((prev) => prev + 1);
		}
	}, [canGoNext]);

	const handlePrev = useCallback(() => {
		if (canGoPrev) {
			setCurrentIndex((prev) => prev - 1);
		}
	}, [canGoPrev]);

	const handleSubmit = async () => {
		if (!canSubmit) return;
		setIsSubmitting(true);

		try {
			const res = await fetch("/api/quiz/submit", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ answers }),
			});

			if (res.ok) {
				router.push("/results");
			}
		} catch {
			console.error("Submit error");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Keyboard navigation
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight" || e.key === "Enter") {
				if (isLastQuestion && canSubmit) {
					handleSubmit();
				} else {
					handleNext();
				}
			} else if (e.key === "ArrowLeft") {
				handlePrev();
			} else if (e.key >= "1" && e.key <= "4") {
				const index = Number.parseInt(e.key) - 1;
				if (index < currentQuestion.options.length) {
					handleSelect(index);
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		currentIndex,
		canGoNext,
		canGoPrev,
		canSubmit,
		isLastQuestion,
		handleNext,
		handlePrev,
	]);

	const progress = ((currentIndex + 1) / questions.length) * 100;

	return (
		<div className="min-h-screen bg-background p-4 md:p-8">
			<div className="max-w-2xl mx-auto">
				{/* Header */}
				<motion.div
					className="mb-6"
					initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
					animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}>
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-2">
							<FileText className="w-5 h-5 text-primary" />
							<span className="text-sm font-medium text-muted-foreground">
								{userName}
							</span>
						</div>
						<span className="text-sm font-medium text-foreground">
							Q {currentIndex + 1} of {questions.length}
						</span>
					</div>
					<Progress
						value={progress}
						className="h-2"
					/>

					{/* Step dots */}
					<div className="flex justify-center gap-1 mt-4 flex-wrap">
						{questions.map((_, idx) => (
							<button
								key={idx}
								onClick={() => {
									// Only allow going to answered questions or current
									if (
										answers[questions[idx].id] !==
											undefined ||
										idx === currentIndex
									) {
										setCurrentIndex(idx);
									}
								}}
								className={`w-2 h-2 rounded-full transition-all ${
									idx === currentIndex
										? "bg-primary w-4"
										: answers[questions[idx].id] !==
										  undefined
										? "bg-primary/50"
										: "bg-muted"
								}`}
								aria-label={`Question ${idx + 1}`}
							/>
						))}
					</div>
				</motion.div>

				{/* Question Card */}
				<AnimatePresence mode="wait">
					<motion.div
						key={currentQuestion.id}
						initial={
							prefersReducedMotion ? {} : { opacity: 0, x: 20 }
						}
						animate={
							prefersReducedMotion ? {} : { opacity: 1, x: 0 }
						}
						exit={
							prefersReducedMotion ? {} : { opacity: 0, x: -20 }
						}
						transition={{ duration: 0.3 }}>
						<Card className="border-border/50 bg-card/80 backdrop-blur-sm mb-6">
							<CardContent className="pt-6 pb-6">
								<span className="text-xs font-medium text-primary/80 uppercase tracking-wide">
									{currentQuestion.category}
								</span>
								<h2 className="text-xl font-semibold text-foreground mt-2 mb-6 text-pretty leading-relaxed">
									{currentQuestion.question}
								</h2>

								<div className="space-y-3">
									{currentQuestion.options.map(
										(option, idx) => {
											const mappedIndex =
												currentQuestion.optionOrder[
													idx
												];
											const isSelected =
												answers[currentQuestion.id] ===
												mappedIndex;
											const isDisabled =
												answers[currentQuestion.id] !==
													undefined && !isSelected;

											return (
												<motion.button
													key={idx}
													onClick={() =>
														handleSelect(idx)
													}
													disabled={
														answers[
															currentQuestion.id
														] !== undefined
													}
													className={`w-full p-4 rounded-lg border text-left transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
														isSelected
															? "border-primary bg-primary/10 text-foreground"
															: isDisabled
															? "border-border/50 bg-muted/30 text-muted-foreground cursor-not-allowed"
															: "border-border hover:border-primary/50 hover:bg-primary/5 text-foreground"
													}`}
													whileHover={
														prefersReducedMotion ||
														answers[
															currentQuestion.id
														] !== undefined
															? {}
															: { scale: 1.01 }
													}
													whileTap={
														prefersReducedMotion ||
														answers[
															currentQuestion.id
														] !== undefined
															? {}
															: { scale: 0.99 }
													}>
													<span className="flex items-center gap-3">
														<span
															className={`w-6 h-6 rounded-full border flex items-center justify-center text-sm font-medium ${
																isSelected
																	? "border-primary bg-primary text-primary-foreground"
																	: "border-border"
															}`}>
															{String.fromCharCode(
																65 + idx
															)}
														</span>
														<span>{option}</span>
													</span>
												</motion.button>
											);
										}
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</AnimatePresence>

				{/* Navigation */}
				<div className="flex items-center justify-between gap-4">
					<Button
						variant="outline"
						onClick={handlePrev}
						disabled={!canGoPrev}
						className="flex-1 sm:flex-none bg-transparent">
						<ChevronLeft className="w-4 h-4 mr-1" />
						পূর্ববর্তী
					</Button>

					{isLastQuestion ? (
						<Button
							onClick={handleSubmit}
							disabled={!canSubmit || isSubmitting}
							className="flex-1 sm:flex-none">
							{isSubmitting ? "জমা হচ্ছে..." : "জমা দিন"}
							<Send className="w-4 h-4 ml-1" />
						</Button>
					) : (
						<Button
							onClick={handleNext}
							disabled={!canGoNext}
							className="flex-1 sm:flex-none">
							পরবর্তী
							<ChevronRight className="w-4 h-4 ml-1" />
						</Button>
					)}
				</div>

				{!isAnswered && (
					<p className="text-center text-muted-foreground text-sm mt-4">
						এগিয়ে যেতে একটি উত্তর নির্বাচন করুন
					</p>
				)}
			</div>
		</div>
	);
}
