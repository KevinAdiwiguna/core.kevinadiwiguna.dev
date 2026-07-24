"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export type experienceProps = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	company: string;
	role: string;
	startDate: Date;
	endDate: Date | null;
	description: string;
	techUsed: string[];
};

interface EditButtonProps {
	experience: experienceProps;
	setSelectedExperience: (experience: experienceProps | null) => void;
	setIsOpen: (open: boolean) => void;
}

export const EditButton = ({ experience, setSelectedExperience, setIsOpen }: EditButtonProps) => {
	const handleEdit = () => {
		setSelectedExperience(experience);
		setIsOpen(true);
	};

	return (
		<Button variant="ghost" size="icon" onClick={handleEdit} className="h-8 w-8 text-muted-foreground hover:text-foreground">
			<Pencil className="h-4 w-4" />
			<span className="sr-only">Edit Experience</span>
		</Button>
	);
};
