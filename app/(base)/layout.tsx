import "@/styles/globals.css";

import { JetBrains_Mono } from "next/font/google";

import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

import { AppSidebar } from "@/components/app-sidebar";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

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
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${jetbrainsMono.variable} min-h-full flex flex-col antialiased`}>
				<QueryProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
						<TooltipProvider>
							<SidebarProvider>
								<AppSidebar />
								<SidebarInset>
									<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
										<div className="flex items-center gap-2 px-4">
											<SidebarTrigger className="-ml-1" />
											<Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
										</div>
									</header>
									<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
								</SidebarInset>
							</SidebarProvider>
						</TooltipProvider>
					</ThemeProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
