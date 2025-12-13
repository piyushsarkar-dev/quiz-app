"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LoginFormProps {
	name: string;
}

export function LoginForm({ name }: LoginFormProps) {
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [attempts, setAttempts] = useState<{
		remaining: number;
		resetIn: number;
	} | null>(null);
	const router = useRouter();

	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
	useEffect(() => {
		const mediaQuery = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		);
		setPrefersReducedMotion(mediaQuery.matches);
	}, []);

	// Password strength meter (purely UI)
	const getPasswordStrength = () => {
		if (password.length === 0) return 0;
		if (password.length < 3) return 20;
		if (password.length < 5) return 60;
		return 100;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const res = await fetch("/api/session/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password }),
			});

			const data = await res.json();

			if (res.ok) {
				router.push("/quiz");
			} else {
				setError(data.error || "ভুল পাসওয়ার্ড");
				if (data.remaining !== undefined) {
					setAttempts({
						remaining: data.remaining,
						resetIn: data.resetIn,
					});
				}
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
								<Lock className="w-8 h-8 text-primary" />
							</div>
						</motion.div>

						<motion.div
							className="text-center mb-8"
							initial={prefersReducedMotion ? {} : { opacity: 0 }}
							animate={prefersReducedMotion ? {} : { opacity: 1 }}
							transition={{ delay: 0.3 }}>
							<h1 className="text-2xl font-bold text-foreground mb-2">
								স্বাগতম, {name}!
							</h1>
							<p className="text-muted-foreground text-sm">
								Piyush-এর কুইজ শুরু করতে পাসওয়ার্ড দিন
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
									htmlFor="password"
									className="block text-sm font-medium text-foreground mb-2">
									পাসওয়ার্ড
								</label>
								<div className="relative">
									<Input
										id="password"
										type={
											showPassword ? "text" : "password"
										}
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										placeholder="পাসওয়ার্ড লিখুন..."
										className="bg-background/50 border-border focus:border-primary pr-10"
										autoComplete="current-password"
										aria-describedby={
											error ? "password-error" : undefined
										}
									/>
									<button
										type="button"
										onClick={() =>
											setShowPassword(!showPassword)
										}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded"
										aria-label={
											showPassword
												? "Hide password"
												: "Show password"
										}>
										{showPassword ? (
											<EyeOff className="h-4 w-4" />
										) : (
											<Eye className="h-4 w-4" />
										)}
									</button>
								</div>

								{/* Password strength meter */}
								<div className="mt-2">
									<Progress
										value={getPasswordStrength()}
										className="h-1"
									/>
									<p className="text-xs text-muted-foreground mt-1">
										{password.length === 0
											? ""
											: password.length < 3
											? "দুর্বল"
											: password.length < 5
											? "মাঝারি"
											: "শক্তিশালী"}
									</p>
								</div>

								{error && (
									<div
										id="password-error"
										className="flex items-center gap-2 text-destructive text-sm mt-2"
										role="alert">
										<AlertCircle className="h-4 w-4" />
										<span>{error}</span>
									</div>
								)}

								{attempts && attempts.remaining < 5 && (
									<p className="text-muted-foreground text-xs mt-2">
										বাকি চেষ্টা: {attempts.remaining}
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
									disabled={isLoading || !password}
									size="lg">
									{isLoading ? (
										"যাচাই হচ্ছে..."
									) : (
										<>
											কুইজ শুরু করুন
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
