"use client";

import { CreateButton } from "./create-button";
import { EditButton } from "./edit-button";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";

import { ExperienceForm } from "./project-form";
import { Modal } from "@/components/modal";
import { useRouter } from "next/navigation";

import { experienceProps, useModal3 } from "@/hooks/use-modal-3";

export const MainForm = ({ totalExperiences, allExperiences }: { totalExperiences: number; allExperiences: experienceProps[] }) => {
	const router = useRouter();
	const { isOpen, selectedExperience, setIsOpen, setSelectedExperience } = useModal3();

	const handleClose = () => {
		setIsOpen(false);
		setSelectedExperience(null);
	};

	return (
		<div className="space-y-6">
			<CreateButton totalProjects={totalExperiences} isOpen={setIsOpen} />

			<div className="rounded-md border font-mono text-xs">
				<Table>
					<TableHeader>
						<TableRow className="uppercase tracking-widest text-muted-foreground">
							<TableHead>Title</TableHead>
							<TableHead>Read Time</TableHead>
							<TableHead>Views</TableHead>
							<TableHead>Update_At</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{allExperiences.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} className="h-24 text-center italic text-muted-foreground">
									NO_RECORDS_FOUND
								</TableCell>
							</TableRow>
						) : (
							allExperiences.map((experience) => (
								<TableRow key={experience.id}>
									<TableCell>
										<div className="flex flex-col">
											<span className="font-bold text-foreground">{experience.company}</span>
											<span className="text-[10px] text-muted-foreground">/{experience.role}</span>
										</div>
									</TableCell>

									<TableCell className="text-muted-foreground">
										{experience.startDate.toLocaleDateString()} - {experience.endDate?.toLocaleDateString() || "Present"}
									</TableCell>
									<TableCell className="text-muted-foreground">{experience.description}</TableCell>
									<TableCell className="text-muted-foreground">{experience.updatedAt.toLocaleDateString()}</TableCell>

									<TableCell className="text-right">
										<EditButton setIsOpen={setIsOpen} experience={experience} setSelectedExperience={setSelectedExperience} />
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<Modal isOpen={isOpen} onClose={handleClose} title={selectedExperience ? "EDIT_EXPERIENCE" : "INITIALIZE_EXPERIENCE"} size="xl">
				<ExperienceForm
					initialData={
						selectedExperience
							? {
									id: selectedExperience.id,
									company: selectedExperience.company,
									role: selectedExperience.role,
									startDate: selectedExperience.startDate,
									endDate: selectedExperience.endDate,
									description: selectedExperience.description,
									techUsed: selectedExperience.techUsed,
									createdAt: selectedExperience.createdAt,
									updatedAt: selectedExperience.updatedAt,
								}
							: undefined
					}
					onSuccess={() => {
						handleClose();
						router.refresh();
					}}
				/>
			</Modal>
		</div>
	);
};
