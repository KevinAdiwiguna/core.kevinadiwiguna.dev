"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	size?: "md" | "lg" | "xl";
}

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
	const sizeClasses = {
		md: "sm:max-w-2xl",
		lg: "sm:max-w-4xl",
		xl: "sm:max-w-6xl",
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className={`w-full ${sizeClasses[size]} bg-zinc-950 border-terminal-green/30 shadow-[0_0_50px_rgba(0,255,65,0.1)] p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col`}>
				<DialogHeader className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex flex-row items-center justify-between space-y-0">
					<DialogTitle className="text-xl font-bold font-mono text-white tracking-tighter uppercase flex items-center gap-2">
						<span className="text-terminal-green">❯</span> {title}
					</DialogTitle>
				</DialogHeader>

				<div className="p-6 overflow-y-auto flex-1">{children}</div>
			</DialogContent>
		</Dialog>
	);
}
