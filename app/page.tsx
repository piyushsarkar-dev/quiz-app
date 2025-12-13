"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	// Check for reduced motion preference
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
	useEffect(() => {
		const mediaQuery = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		);
		setPrefersReducedMotion(mediaQuery.matches);
	}, []);

	const sanitizeName = (input: string): string => {
		return input.replace(/[<>'"&]/g, "").trim();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		const sanitized = sanitizeName(name);

		if (!sanitized) {
			setError("Yo Tell Me Your Name");
			return;
		}

		if (sanitized.length > 40) {
			setError("40 Words limit");
			return;
		}

		setIsLoading(true);

		try {
			const res = await fetch("/api/session/name", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name: sanitized }),
			});

			if (res.ok) {
				router.push("/login");
			} else {
				setError("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
			}
		} catch {
			setError("কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।");
		} finally {
			setIsLoading(false);
		}
	};

	const motionProps = prefersReducedMotion
		? {}
		: {
				initial: { opacity: 0, y: 20 },
				animate: { opacity: 1, y: 0 },
				transition: { duration: 0.6 },
		  };

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<motion.div
				{...motionProps}
				className="w-full max-w-md">
				<Card className="border-border/50 bg-card/80 backdrop-blur-sm">
					<CardContent className="pt-8 pb-8">
						<motion.div
							className="flex justify-center mb-6"
							initial={prefersReducedMotion ? {} : { scale: 0 }}
							animate={prefersReducedMotion ? {} : { scale: 1 }}
							transition={{
								delay: 0.2,
								type: "spring",
								stiffness: 200,
							}}>
							<div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
								<FileText className="w-8 h-8 text-primary" />
							</div>
						</motion.div>

						<motion.div
							className="text-center mb-8"
							initial={prefersReducedMotion ? {} : { opacity: 0 }}
							animate={prefersReducedMotion ? {} : { opacity: 1 }}
							transition={{ delay: 0.3 }}>
							<h1 className="text-2xl font-bold text-foreground mb-2 text-balance">
								quiz-application
							</h1>
							<p className="text-muted-foreground text-sm">
								Created By Piyush
							</p>
						</motion.div>

						<form
							onSubmit={handleSubmit}
							className="space-y-4">
							<motion.div
								initial={
									prefersReducedMotion
										? {}
										: { opacity: 0, x: -20 }
								}
								animate={
									prefersReducedMotion
										? {}
										: { opacity: 1, x: 0 }
								}
								transition={{ delay: 0.4 }}>
								<label
									htmlFor="name"
									className="block text-sm font-medium text-foreground mb-2">
									আপনার নাম কী?
								</label>
								<Input
									id="name"
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="আপনার নাম লিখুন..."
									className="bg-background/50 border-border focus:border-primary"
									maxLength={40}
									autoComplete="name"
									aria-describedby={
										error ? "name-error" : undefined
									}
								/>
								{error && (
									<p
										id="name-error"
										className="text-destructive text-sm mt-2"
										role="alert">
										{error}
									</p>
								)}
							</motion.div>

							<motion.div
								initial={
									prefersReducedMotion ? {} : { opacity: 0 }
								}
								animate={
									prefersReducedMotion ? {} : { opacity: 1 }
								}
								transition={{ delay: 0.5 }}>
								<Button
									type="submit"
									className="w-full"
									disabled={isLoading}
									size="lg">
									{isLoading ? (
										"লোড হচ্ছে..."
									) : (
										<>
											শুরু করুন
											<ArrowRight className="ml-2 h-4 w-4" />
										</>
									)}
								</Button>
							</motion.div>
						</form>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
