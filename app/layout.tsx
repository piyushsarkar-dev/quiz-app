import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "quiz-application by Piyush",
	description:
		"Piyush তৈরি করেছেন Microsoft Word দক্ষতা যাচাইয়ের ইন্টারেক্টিভ কুইজ।",
	applicationName: "quiz-application",
	authors: [{ name: "Piyush" }],
	creator: "Piyush",
	keywords: ["quiz-application", "Piyush", "Microsoft Word quiz"],
	icons: {
		icon: "/icon.png",
		apple: "/icon.png",
	},
};

export const viewport: Viewport = {
	themeColor: "#0a0a0a",
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="bn"
			className="dark">
			<body className="font-sans antialiased">
				{children}
				<Analytics />
			</body>
		</html>
	);
}
