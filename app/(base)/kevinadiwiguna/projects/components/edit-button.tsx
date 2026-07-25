"use client";

import { ProjectStatus } from "@/app/generated/prisma/kevinadiwiguna/client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export type totalProjectsType = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	image: string | null;
	title: string;
	slug: string;
	shortDescription: string;
	content: string;
	githubUrl: string | null;
	liveUrl: string | null;
	isFeatured: boolean;
	status: ProjectStatus;
	technologies: {
		id: string;
		name: string;
	}[];
	categories: {
		id: string;
		name: string;
	}[];
};

interface EditButtonProps {
	project: totalProjectsType;
	setSelectedProject: (project: totalProjectsType) => void;
	setIsOpen: (open: boolean) => void;
}

export const EditButton = ({ project, setSelectedProject, setIsOpen }: EditButtonProps) => {
	const handleEdit = () => {
		setSelectedProject(project);
		setIsOpen(true);
	};

	return (
		<Button variant="ghost" size="icon" onClick={handleEdit} className="h-8 w-8 text-muted-foreground hover:text-foreground">
			<Pencil className="h-4 w-4" />
			<span className="sr-only">Edit Project</span>
		</Button>
	);
};
