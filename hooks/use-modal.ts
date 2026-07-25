"use client"
import { ProjectStatus } from "@/app/generated/prisma/kevinadiwiguna/client";
import { useState } from "react";

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


export const useModal = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedProject, setSelectedProject] = useState<totalProjectsType | null>(null);

	return { isOpen, setIsOpen, selectedProject, setSelectedProject };
};
