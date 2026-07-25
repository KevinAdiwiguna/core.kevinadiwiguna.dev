import { JetBrains_Mono } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "@/styles/globals.css";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
});

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (session && session.user) {
		redirect("/kevinadiwiguna");
	}
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${jetbrainsMono.variable} min-h-full flex flex-col antialiased`}>
				<QueryProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
						{children}
					</ThemeProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
