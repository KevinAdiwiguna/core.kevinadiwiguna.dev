"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Editor } from "@/components/tiptap";
import { uploadImage } from "@/lib/db/s3";
import { Save, Loader2, Image as ImageIcon, X, Plus } from "lucide-react";
import Image from "next/image";

type ProjectStatus = "ONGOING" | "COMPLETED";

export type Project = {
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

type ProjectFormData = Omit<Project, "id" | "createdAt" | "updatedAt" | "technologies" | "categories"> & {
	id?: string;
	techIds?: string[];
	categoryIds?: string[];
	techNames?: string | string[];
	categoryNames?: string | string[];
};

interface ProjectFormProps {
	initialData?: Partial<Project>;
	onSuccess: () => void;
	technologies?: Array<{ id: string; name: string }>;
	categories?: Array<{ id: string; name: string }>;
}

const saveProjectApi = async (data: ProjectFormData) => {
	const isEdit = Boolean(data.id);
	const endpoint = isEdit ? `/api/kevinadiwiguna/project/${data.id}` : "/api/kevinadiwiguna/project";
	const method = isEdit ? "PUT" : "POST";

	const response = await fetch(endpoint, {
		method,
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "OPERATION_FAILED");
	}

	return response.json();
};

export function ProjectForm({ initialData, onSuccess, technologies = [], categories = [] }: ProjectFormProps) {
	const queryClient = useQueryClient();
	const [uploading, setUploading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [techInput, setTechInput] = useState("");
	const [categoryInput, setCategoryInput] = useState("");

	const [formData, setFormData] = useState<ProjectFormData>({
		id: initialData?.id,
		title: initialData?.title || "",
		slug: initialData?.slug || "",
		shortDescription: initialData?.shortDescription || "",
		content: initialData?.content || "",
		image: initialData?.image ?? null,
		githubUrl: initialData?.githubUrl ?? null,
		liveUrl: initialData?.liveUrl ?? null,
		isFeatured: initialData?.isFeatured ?? false,
		status: initialData?.status || "COMPLETED",
		techNames: initialData?.technologies?.map((t) => t.name) ?? [],
		categoryNames: initialData?.categories?.map((c) => c.name) ?? [],
	});

	const { mutate: saveProject, isPending } = useMutation({
		mutationFn: saveProjectApi,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			onSuccess();
		},
		onError: (error: Error) => {
			console.error("PROJECT_SUBMIT_ERROR:", error);
			alert(error.message || "OPERATION_FAILED");
		},
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value, type } = e.target;
		const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

		setFormData((prev) => ({ ...prev, [name]: val }));

		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const addTech = (tech: string) => {
		const trimmed = tech.trim();
		const techs = Array.isArray(formData.techNames) ? formData.techNames : [];
		if (trimmed && !techs.includes(trimmed)) {
			setFormData((prev) => ({
				...prev,
				techNames: [...techs, trimmed],
			}));
		}
		setTechInput("");
	};

	const removeTech = (tech: string) => {
		const techs = Array.isArray(formData.techNames) ? formData.techNames : [];
		setFormData((prev) => ({
			...prev,
			techNames: techs.filter((t) => t !== tech),
		}));
	};

	const addCategory = (category: string) => {
		const trimmed = category.trim();
		const cats = Array.isArray(formData.categoryNames) ? formData.categoryNames : [];
		if (trimmed && !cats.includes(trimmed)) {
			setFormData((prev) => ({
				...prev,
				categoryNames: [...cats, trimmed],
			}));
		}
		setCategoryInput("");
	};

	const removeCategory = (category: string) => {
		const cats = Array.isArray(formData.categoryNames) ? formData.categoryNames : [];
		setFormData((prev) => ({
			...prev,
			categoryNames: cats.filter((c) => c !== category),
		}));
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const title = e.target.value;
		setFormData((prev) => ({
			...prev,
			title,
			slug: initialData?.id
				? prev.slug
				: title
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, "-")
						.replace(/(^-|-$)+/g, ""),
		}));

		if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		try {
			const url = (await uploadImage(file)) as string;
			setFormData((prev) => ({ ...prev, image: url }));
			if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
		} catch (error) {
			console.error(error);
			alert("UPLOAD_FAILED");
		} finally {
			setUploading(false);
		}
	};

	const validate = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.title.trim()) newErrors.title = "Title wajib diisi";
		if (!formData.slug.trim()) newErrors.slug = "Slug wajib diisi";
		if (!formData.shortDescription.trim()) newErrors.shortDescription = "Deskripsi singkat wajib diisi";
		if (!formData.content.trim()) newErrors.content = "Konten utama wajib diisi";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		const techNames = Array.isArray(formData.techNames) ? formData.techNames.join(", ") : "";
		const categoryNames = Array.isArray(formData.categoryNames) ? formData.categoryNames.join(", ") : "";

		saveProject({
			...formData,
			techNames,
			categoryNames,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-4">
					<div className="space-y-2">
						<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Project_Title</label>
						<input name="title" value={formData.title} onChange={handleTitleChange} className="w-full bg-background border border-input rounded-sm p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />
						{errors.title && <p className="text-destructive text-[10px] font-mono">{errors.title}</p>}
					</div>

					<div className="space-y-2">
						<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Resource_Slug</label>
						<input name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-background border border-input rounded-sm p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />
						{errors.slug && <p className="text-destructive text-[10px] font-mono">{errors.slug}</p>}
					</div>
				</div>

				<div className="space-y-2">
					<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Preview_Image</label>
					<div className="relative aspect-video bg-muted/50 border border-input rounded-sm overflow-hidden flex items-center justify-center group">
						{formData.image ? (
							<>
								<Image src={formData.image} alt="Preview" fill className="object-cover" />
								<button type="button" onClick={() => setFormData((prev) => ({ ...prev, image: null }))} className="absolute top-2 right-2 p-1 bg-background/80 hover:bg-background text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm">
									<X size={14} />
								</button>
							</>
						) : (
							<label className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
								{uploading ? <Loader2 size={24} className="animate-spin text-primary" /> : <ImageIcon size={24} />}
								<span className="text-[10px] font-mono">UPLOAD_MEDIA</span>
								<input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
							</label>
						)}
					</div>
					{errors.image && <p className="text-destructive text-[10px] font-mono">{errors.image}</p>}
				</div>
			</div>

			<div className="space-y-2">
				<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Brief_Description</label>
				<textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2} className="w-full bg-background border border-input rounded-sm p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />
				{errors.shortDescription && <p className="text-destructive text-[10px] font-mono">{errors.shortDescription}</p>}
			</div>

			<div className="space-y-2">
				<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Main_Content</label>
				<Editor
					content={formData.content}
					onChange={(val) => {
						setFormData((prev) => ({ ...prev, content: val }));
						if (errors.content) setErrors((prev) => ({ ...prev, content: "" }));
					}}
				/>
				{errors.content && <p className="text-destructive text-[10px] font-mono">{errors.content}</p>}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Github_Endpoint</label>
					<input name="githubUrl" value={formData.githubUrl || ""} onChange={handleChange} className="w-full bg-background border border-input rounded-sm p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />
				</div>
				<div className="space-y-2">
					<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Live_Deployment</label>
					<input name="liveUrl" value={formData.liveUrl || ""} onChange={handleChange} className="w-full bg-background border border-input rounded-sm p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />
				</div>
			</div>

			{/* Existing Categories Selection */}
			{categories.length > 0 && (
				<div className="space-y-3">
					<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Select Categories</label>
					<div className="flex flex-wrap gap-2">
						{categories.map((category) => {
							const isSelected = formData.categoryNames?.includes(category.name);
							return (
								<button
									key={category.id}
									type="button"
									onClick={() => {
										if (isSelected) {
											removeCategory(category.name);
										} else {
											addCategory(category.name);
										}
									}}
									className={`px-3 py-2 rounded-sm font-mono text-[10px] transition-colors ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
								>
									{category.name}
								</button>
							);
						})}
					</div>
				</div>
			)}

			{/* Existing Technologies Selection */}
			{technologies.length > 0 && (
				<div className="space-y-3">
					<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Select Technologies</label>
					<div className="flex flex-wrap gap-2">
						{technologies.map((tech) => {
							const isSelected = formData.techNames?.includes(tech.name);
							return (
								<button
									key={tech.id}
									type="button"
									onClick={() => {
										if (isSelected) {
											removeTech(tech.name);
										} else {
											addTech(tech.name);
										}
									}}
									className={`px-3 py-2 rounded-sm font-mono text-[10px] transition-colors ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
								>
									{tech.name}
								</button>
							);
						})}
					</div>
				</div>
			)}

			{/* Add New Categories Input */}
			<div className="space-y-3">
				<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Add New Categories</label>

				<div className="flex gap-2">
					<input
						value={categoryInput}
						onChange={(e) => setCategoryInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								addCategory(categoryInput);
							}
						}}
						placeholder="e.g. Web App, Mobile, Open Source..."
						className="flex-1 bg-background border border-input rounded-sm p-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
					/>
					<button type="button" onClick={() => addCategory(categoryInput)} className="px-3 bg-muted hover:bg-muted/80 text-foreground border border-input rounded-sm transition-colors">
						<Plus size={16} />
					</button>
				</div>

				<div className="flex flex-wrap gap-2 pt-1">
					{Array.isArray(formData.categoryNames) &&
						formData.categoryNames.map((category) => (
							<span key={category} className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-sm font-mono text-[11px]">
								{category}
								<button type="button" onClick={() => removeCategory(category)} className="hover:opacity-70 transition-opacity">
									<X size={12} />
								</button>
							</span>
						))}
				</div>
			</div>

			{/* Add New Technologies Input */}
			<div className="space-y-3">
				<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Add New Technologies</label>

				<div className="flex gap-2">
					<input
						value={techInput}
						onChange={(e) => setTechInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								addTech(techInput);
							}
						}}
						placeholder="e.g. Next.js, Prisma, Tailwind CSS..."
						className="flex-1 bg-background border border-input rounded-sm p-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
					/>
					<button type="button" onClick={() => addTech(techInput)} className="px-3 bg-muted hover:bg-muted/80 text-foreground border border-input rounded-sm transition-colors">
						<Plus size={16} />
					</button>
				</div>

				<div className="flex flex-wrap gap-2 pt-1">
					{Array.isArray(formData.techNames) &&
						formData.techNames.map((tech) => (
							<span key={tech} className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-sm font-mono text-[11px]">
								{tech}
								<button type="button" onClick={() => removeTech(tech)} className="hover:opacity-70 transition-opacity">
									<X size={12} />
								</button>
							</span>
						))}
				</div>
			</div>

			<div className="flex items-center justify-between pt-4 border-t border-border">
				<div className="flex items-center gap-6">
					<div className="flex items-center gap-2">
						<input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-ring" />
						<label className="font-mono text-[10px] text-muted-foreground uppercase">Featured</label>
					</div>
					<div className="flex items-center gap-2">
						<label className="font-mono text-[10px] text-muted-foreground uppercase">Status:</label>
						<select name="status" value={formData.status} onChange={handleChange} className="bg-background border border-input rounded-sm p-1 font-mono text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
							<option value="COMPLETED">COMPLETED</option>
							<option value="ONGOING">ONGOING</option>
						</select>
					</div>
				</div>

				<button type="submit" disabled={isPending || uploading} className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-mono font-bold rounded-sm hover:bg-primary/90 transition-all disabled:opacity-50">
					{isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
					EXECUTE_COMMIT
				</button>
			</div>
		</form>
	);
}
