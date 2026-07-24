"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Editor } from "@/components/tiptap";
import { uploadImage } from "@/lib/db/s3";
import { Save, Loader2, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

type ProjectStatus = "ONGOING" | "COMPLETED";

type ProjectFormData = {
	id?: string;
	title: string;
	slug: string;
	shortDescription: string;
	content: string;
	image: string;
	githubUrl: string;
	liveUrl: string;
	isFeatured: boolean;
	status: ProjectStatus;
};

interface ProjectFormProps {
	initialData?: Partial<ProjectFormData>;
	onSuccess: () => void;
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

export function ProjectForm({ initialData, onSuccess }: ProjectFormProps) {
	const queryClient = useQueryClient();
	const [uploading, setUploading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const [formData, setFormData] = useState<ProjectFormData>({
		id: initialData?.id,
		title: initialData?.title || "",
		slug: initialData?.slug || "",
		shortDescription: initialData?.shortDescription || "",
		content: initialData?.content || "",
		image: initialData?.image || "",
		githubUrl: initialData?.githubUrl || "",
		liveUrl: initialData?.liveUrl || "",
		isFeatured: initialData?.isFeatured ?? false,
		status: initialData?.status || "COMPLETED",
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

		saveProject(formData);
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
								<button type="button" onClick={() => setFormData((prev) => ({ ...prev, image: "" }))} className="absolute top-2 right-2 p-1 bg-background/80 hover:bg-background text-foreground rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm">
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
					<input name="githubUrl" value={formData.githubUrl} onChange={handleChange} className="w-full bg-background border border-input rounded-sm p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />
				</div>
				<div className="space-y-2">
					<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Live_Deployment</label>
					<input name="liveUrl" value={formData.liveUrl} onChange={handleChange} className="w-full bg-background border border-input rounded-sm p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />
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
