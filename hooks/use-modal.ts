"use client"
import {  ProjectStatus } from "@/app/generated/prisma/kevinadiwiguna/client";
import { useState } from "react";

export type totalProjectsType = {
	title: string;
	image: string | null;
	id: string;
	slug: string;
	shortDescription: string;
	content: string;
	githubUrl: string | null;
	liveUrl: string | null;
	isFeatured: boolean;
	status: ProjectStatus;
	createdAt: Date;
	updatedAt: Date;
};


export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
	const [selectedProject, setSelectedProject] = useState<totalProjectsType | null>(null);

    return { isOpen, setIsOpen, selectedProject, setSelectedProject };
};
