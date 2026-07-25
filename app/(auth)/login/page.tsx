import { Metadata } from "next";
import LoginForm from "./components/login-form";
import { Terminal } from "lucide-react";

export const metadata: Metadata = {
	title: "Secure Access | Admin",
	description: "Establish secure session.",
};

export default async function LoginPage() {
	return (
		<div className="min-h-screen w-full flex bg-background">
			<div className="hidden lg:flex w-1/2 border-r border-border relative items-center justify-center overflow-hidden">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

				<div className="relative z-10 p-12 max-w-lg">
					<div className="p-4 rounded-xl bg-primary/10 border border-primary/20 inline-block mb-8">
						<Terminal className="h-12 w-12 text-primary" />
					</div>
					<h1 className="text-4xl font-bold tracking-tighter text-foreground font-heading uppercase mb-4">
						System_ <br /> Initialized
					</h1>
					<p className="text-muted-foreground font-mono text-sm leading-relaxed">&quot;Welcome to the mainframe. Authentication is required to access the central database and control systems. Unauthorized access is strictly prohibited.&quot;</p>
				</div>
			</div>

			<div className="flex-1 flex items-center justify-center p-4 sm:p-8">
				<LoginForm />
			</div>
		</div>
	);
}
