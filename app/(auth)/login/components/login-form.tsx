"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Terminal, Lock, Mail, AlertCircle, Loader2, GitBranch } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
	email: z.string().min(1, "Identifier is required").email("Invalid email format"),
	password: z.string().min(8, "Auth_Key must be at least 8 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
	const [socialLoading, setSocialLoading] = useState<"github" | "google" | null>(null);

	const {
		mutate: loginMutation,
		isPending,
		error: mutationError,
	} = useMutation({
		mutationFn: async (values: LoginValues) => {
			const { data, error } = await authClient.signIn.email({
				email: values.email,
				password: values.password,
			});

			if (error) throw new Error(error.message || "AUTHENTICATION_FAILED");
			return data;
		},
		onSuccess: () => {
			router.push("/");
			router.refresh();
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setValidationErrors({});

		const result = loginSchema.safeParse({ email, password });

		if (!result.success) {
			const errors: Record<string, string> = {};
			result.error.issues.forEach((issue) => {
				if (issue.path[0]) {
					errors[issue.path[0].toString()] = issue.message;
				}
			});
			setValidationErrors(errors);
			return;
		}

		loginMutation({ email, password });
	};

	const handleSocialLogin = async (provider: "github" | "google") => {
		setSocialLoading(provider);
		try {
			await authClient.signIn.social({
				provider,
				callbackURL: "/",
			});
		} catch (error) {
			console.error("Social login failed", error);
		} finally {
			setSocialLoading(null);
		}
	};

	return (
		<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-md w-full space-y-8 p-8 sm:border sm:border-primary/20 sm:bg-background/50 rounded-lg sm:shadow-2xl">
			<div className="text-center space-y-2 lg:hidden">
				<div className="flex justify-center mb-4">
					<div className="p-3 rounded-full bg-primary/10 border border-primary/30">
						<Terminal className="h-8 w-8 text-primary" />
					</div>
				</div>
				<h2 className="text-2xl font-bold tracking-tighter text-foreground font-heading uppercase">SECURE_ACCESS</h2>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{mutationError && (
					<div className="p-3 bg-destructive/10 border border-destructive/50 rounded flex items-center gap-2 text-destructive text-xs font-mono">
						<AlertCircle size={14} />
						<span>{mutationError.message}</span>
					</div>
				)}

				<div className="space-y-4">
					<div className="space-y-2">
						<label className="block font-mono text-[10px] text-muted-foreground uppercase ml-1">Identifier (Email)</label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@adiwiguna.dev" className={`bg-background border-primary/20 pl-10 font-mono text-sm focus-visible:ring-1 focus-visible:ring-primary rounded-sm text-foreground ${validationErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}`} />
						</div>
						{validationErrors.email && <p className="font-mono text-[10px] text-destructive ml-1">{validationErrors.email}</p>}
					</div>

					<div className="space-y-2">
						<label className="block font-mono text-[10px] text-muted-foreground uppercase ml-1">Auth_Key (Password)</label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`bg-background border-primary/20 pl-10 font-mono text-sm focus-visible:ring-1 focus-visible:ring-primary rounded-sm text-foreground ${validationErrors.password ? "border-destructive focus-visible:ring-destructive" : ""}`} />
						</div>
						{validationErrors.password && <p className="font-mono text-[10px] text-destructive ml-1">{validationErrors.password}</p>}
					</div>
				</div>

				<Button type="submit" disabled={isPending || socialLoading !== null} className="w-full flex items-center justify-center gap-2 py-6 bg-primary text-primary-foreground font-mono font-bold rounded-sm hover:bg-primary/90 transition-all">
					{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "ESTABLISH_CONNECTION"}
				</Button>
			</form>

			<div className="relative my-6">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-primary/20"></div>
				</div>
				<div className="relative flex justify-center text-[10px] font-mono uppercase tracking-widest">
					<span className="bg-background px-4 text-muted-foreground">OR_INITIALIZE_VIA</span>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<Button type="button" variant="outline" disabled={isPending || socialLoading !== null} onClick={() => handleSocialLogin("github")} className="bg-background border-primary/20 text-foreground font-mono hover:bg-primary/10 hover:text-primary rounded-sm transition-colors py-6">
					{socialLoading === "github" ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<>
							<svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
								/>
							</svg>
							GITHUB
						</>
					)}
				</Button>
				<Button type="button" variant="outline" disabled={isPending || socialLoading !== null} onClick={() => handleSocialLogin("google")} className="bg-background border-primary/20 text-foreground font-mono hover:bg-primary/10 hover:text-primary rounded-sm transition-colors py-6">
					{socialLoading === "google" ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<>
							<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
								<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
								<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
								<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
								<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
							</svg>
							GOOGLE
						</>
					)}
				</Button>
			</div>
		</motion.div>
	);
}
