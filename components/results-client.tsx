"use client";

import { Balloons } from "@/components/balloons";
import { Confetti } from "@/components/confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import {
	CheckCircle,
	Eye,
	Home,
	RefreshCw,
	Trophy,
	X,
	XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Question {
	id: number;
	category: string;
	question: string;
	options: string[];
	correctIndex: number;
}

interface ResultsClientProps {
	userName: string;
	correct: number;
	total: number;
	percentage: number;
	answers: Record<number, number>;
	questions: Question[];
}

export function ResultsClient({
	userName,
	correct,
	total,
	percentage,
	answers,
	questions,
}: ResultsClientProps) {
	const [showReview, setShowReview] = useState(false);
	const [showCelebration, setShowCelebration] = useState(false);
	const router = useRouter();

	const isSuccess = percentage >= 75;

	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
	useEffect(() => {
		const mediaQuery = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		);
		setPrefersReducedMotion(mediaQuery.matches);

		if (isSuccess && !mediaQuery.matches) {
			setShowCelebration(true);
		}
	}, [isSuccess]);

	const handleRetake = async () => {
		await fetch("/api/quiz/reset", { method: "POST" });
		router.push("/quiz");
	};

	const handleHome = async () => {
		await fetch("/api/session/logout", { method: "POST" });
		router.push("/");
	};

	return (
		<div className="min-h-screen bg-background p-4 md:p-8 relative overflow-hidden">
			{/* Celebration effects */}
			{showCelebration && !prefersReducedMotion && (
				<>
					<Confetti />
					<Balloons />
				</>
			)}

			<div className="max-w-2xl mx-auto relative z-10">
				{/* Success Ribbon */}
				<AnimatePresence>
					{isSuccess && (
						<motion.div
							className="text-center mb-6"
							initial={
								prefersReducedMotion
									? {}
									: { opacity: 0, scale: 0.5, y: -50 }
							}
							animate={
								prefersReducedMotion
									? {}
									: { opacity: 1, scale: 1, y: 0 }
							}
							transition={{
								delay: 0.2,
								type: "spring",
								stiffness: 200,
							}}>
							<div className="inline-block bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-8 py-3 rounded-full font-bold text-lg shadow-lg">
								🏆 Excellent! 🏆
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Name animation for success */}
				{isSuccess && (
					<motion.div
						className="text-center mb-4"
						initial={
							prefersReducedMotion ? {} : { opacity: 0, y: -30 }
						}
						animate={
							prefersReducedMotion ? {} : { opacity: 1, y: 0 }
						}
						transition={{
							delay: 0.4,
							type: "spring",
							bounce: 0.5,
						}}>
						<span className="text-2xl md:text-3xl font-bold text-foreground">
							🎉 {userName} 🎉
						</span>
					</motion.div>
				)}

				{/* Result Card */}
				<motion.div
					initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
					animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
					transition={{ delay: isSuccess ? 0.6 : 0.2 }}>
					<Card className="border-border/50 bg-card/80 backdrop-blur-sm mb-6">
						<CardContent className="pt-8 pb-8 text-center">
							<motion.div
								className="flex justify-center mb-6"
								initial={
									prefersReducedMotion ? {} : { scale: 0 }
								}
								animate={
									prefersReducedMotion ? {} : { scale: 1 }
								}
								transition={{
									delay: isSuccess ? 0.8 : 0.4,
									type: "spring",
								}}>
								<div
									className={`w-20 h-20 rounded-full flex items-center justify-center ${
										isSuccess
											? "bg-green-500/20"
											: "bg-amber-500/20"
									}`}>
									<Trophy
										className={`w-10 h-10 ${
											isSuccess
												? "text-green-500"
												: "text-amber-500"
										}`}
									/>
								</div>
							</motion.div>

							{!isSuccess && (
								<h1 className="text-2xl font-bold text-foreground mb-2">
									{userName}
								</h1>
							)}

							<div className="mb-4">
								<span
									className={`text-5xl font-bold ${
										isSuccess
											? "text-green-500"
											: "text-amber-500"
									}`}>
									{percentage}%
								</span>
							</div>

							<p className="text-lg text-foreground mb-2">
								{correct} / {total} সঠিক উত্তর
							</p>

							<p className="text-muted-foreground">
								{isSuccess
									? "অসাধারণ! Piyush-এর কুইজে আপনি দুর্দান্ত করেছেন!"
									: "আবার চেষ্টা করুন। আপনি পারবেন!"}
							</p>
						</CardContent>
					</Card>
				</motion.div>

				{/* Action Buttons */}
				<motion.div
					className="flex flex-col sm:flex-row gap-3 justify-center"
					initial={prefersReducedMotion ? {} : { opacity: 0 }}
					animate={prefersReducedMotion ? {} : { opacity: 1 }}
					transition={{ delay: isSuccess ? 1 : 0.6 }}>
					<Button
						variant="outline"
						onClick={() => setShowReview(true)}
						className="flex-1 sm:flex-none">
						<Eye className="w-4 h-4 mr-2" />
						উত্তর দেখুন
					</Button>
					<Button
						variant="outline"
						onClick={handleRetake}
						className="flex-1 sm:flex-none bg-transparent">
						<RefreshCw className="w-4 h-4 mr-2" />
						আবার দিন
					</Button>
					<Button
						onClick={handleHome}
						className="flex-1 sm:flex-none">
						<Home className="w-4 h-4 mr-2" />
						হোম
					</Button>
				</motion.div>
			</div>

			{/* Review Modal */}
			<AnimatePresence>
				{showReview && (
					<motion.div
						className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowReview(false)}>
						<motion.div
							className="bg-card border border-border rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
							initial={
								prefersReducedMotion
									? {}
									: { scale: 0.9, opacity: 0 }
							}
							animate={
								prefersReducedMotion
									? {}
									: { scale: 1, opacity: 1 }
							}
							exit={
								prefersReducedMotion
									? {}
									: { scale: 0.9, opacity: 0 }
							}
							onClick={(e) => e.stopPropagation()}>
							<div className="flex items-center justify-between p-4 border-b border-border">
								<h2 className="text-lg font-semibold text-foreground">
									উত্তর পর্যালোচনা
								</h2>
								<button
									onClick={() => setShowReview(false)}
									className="text-muted-foreground hover:text-foreground p-1 rounded focus:outline-none focus:ring-2 focus:ring-ring">
									<X className="w-5 h-5" />
								</button>
							</div>
							<div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)]">
								<div className="space-y-4">
									{questions.map((q, idx) => {
										const userAnswer = answers[q.id];
										const isCorrect =
											userAnswer === q.correctIndex;

										return (
											<div
												key={q.id}
												className={`p-4 rounded-lg border ${
													isCorrect
														? "border-green-500/30 bg-green-500/5"
														: "border-red-500/30 bg-red-500/5"
												}`}>
												<div className="flex items-start gap-2 mb-2">
													{isCorrect ? (
														<CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
													) : (
														<XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
													)}
													<div>
														<span className="text-xs text-muted-foreground">
															Q{idx + 1} •{" "}
															{q.category}
														</span>
														<p className="text-sm font-medium text-foreground mt-1">
															{q.question}
														</p>
													</div>
												</div>
												<div className="ml-7 space-y-1">
													{q.options.map(
														(opt, optIdx) => (
															<div
																key={optIdx}
																className={`text-sm px-2 py-1 rounded ${
																	optIdx ===
																	q.correctIndex
																		? "bg-green-500/20 text-green-400"
																		: optIdx ===
																				userAnswer &&
																		  !isCorrect
																		? "bg-red-500/20 text-red-400"
																		: "text-muted-foreground"
																}`}>
																{String.fromCharCode(
																	65 + optIdx
																)}
																) {opt}
																{optIdx ===
																	q.correctIndex &&
																	" ✓"}
																{optIdx ===
																	userAnswer &&
																	!isCorrect &&
																	" ✗"}
															</div>
														)
													)}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
