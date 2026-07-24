"use client";

import { ProjectStatus } from "@/app/generated/prisma/kevinadiwiguna/enums";

import { CreateButton } from "./create-button";
import { EditButton } from "./edit-button";
import { Badge } from "@/components/ui/badge";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";

import { useModal } from "@/hooks/use-modal";
import { ProjectForm } from "./project-form";
import { Modal } from "@/components/modal";
import { useRouter } from "next/navigation";
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

export const MainForm = ({ totalProjects, getAllProjects }: { totalProjects: number; getAllProjects: totalProjectsType[] }) => {
	const router = useRouter();
	const { isOpen, selectedProject, setIsOpen, setSelectedProject } = useModal();

	const handleClose = () => {
		setIsOpen(false);
		setSelectedProject(null);
	};

	return (
		<div className="space-y-6">
			<CreateButton totalProjects={totalProjects} isOpen={setIsOpen} />

			<div className="rounded-md border font-mono text-xs">
				<Table>
					<TableHeader>
						<TableRow className="uppercase tracking-widest text-muted-foreground">
							<TableHead className="w-30">Status</TableHead>
							<TableHead>Title</TableHead>
							<TableHead>Created_At</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{getAllProjects.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} className="h-24 text-center italic text-muted-foreground">
									NO_RECORDS_FOUND
								</TableCell>
							</TableRow>
						) : (
							getAllProjects.map((project) => (
								<TableRow key={project.id}>
									<TableCell>
										<Badge variant={project.status === "COMPLETED" ? "default" : "secondary"} className="font-mono text-[10px] rounded-sm uppercase">
											[{project.status}]
										</Badge>
									</TableCell>

									<TableCell>
										<div className="flex flex-col">
											<span className="font-bold text-foreground">{project.title}</span>
											<span className="text-[10px] text-muted-foreground">/{project.slug}</span>
										</div>
									</TableCell>

									<TableCell className="text-muted-foreground">{new Date(project.createdAt).toLocaleDateString()}</TableCell>

									<TableCell className="text-right">
										<EditButton setIsOpen={setIsOpen} project={project} setSelectedProject={setSelectedProject} />
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<Modal isOpen={isOpen} onClose={handleClose} title={selectedProject ? "EDIT_PROJECT" : "INITIALIZE_PROJECT"} size="xl">
				<ProjectForm
					initialData={
						selectedProject
							? {
									id: selectedProject.id,
									title: selectedProject.title,
									slug: selectedProject.slug,
									shortDescription: selectedProject.shortDescription,
									content: selectedProject.content,
									image: selectedProject.image || "",
									githubUrl: selectedProject.githubUrl || "",
									liveUrl: selectedProject.liveUrl || "",
									isFeatured: selectedProject.isFeatured ?? false,
									status: selectedProject.status,
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
