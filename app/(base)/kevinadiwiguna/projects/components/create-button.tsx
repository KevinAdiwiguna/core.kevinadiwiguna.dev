"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CreateButton = ({ totalProjects, isOpen }: { totalProjects: number; isOpen: (value: boolean) => void }) => {
	return (
		<div className="flex items-center justify-between">
			<div className="space-y-1">
				<h1 className="text-3xl font-bold tracking-tight font-mono uppercase">MANAGE_PROJECTS</h1>
				<p className="text-xs text-muted-foreground italic">Total entities: {totalProjects}</p>
			</div>

			<Button onClick={() => isOpen(true)} className="cursor-pointer text-xs font-bold gap-2">
				<Plus className="h-4 w-4" />
				CREATE_NEW
			</Button>
		</div>
	);
};
