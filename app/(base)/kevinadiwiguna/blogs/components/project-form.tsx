"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Editor } from "@/components/tiptap"; // sesuaikan path editor Anda
import { uploadImage } from "@/lib/db/s3"; // sesuaikan path upload service Anda
import { Save, Loader2, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

export type BlogPost = {
	id: string;
	title: string;
	slug: string;
	content: string;
	image: string | null;
	excerpt: string | null;
	published: boolean;
	readTime: number | null;
	views: number;
	createdAt: Date;
	updatedAt: Date;
};

type PostFormData = Omit<BlogPost, "id" | "views" | "createdAt" | "updatedAt"> & {
	id?: string;
};

interface PostFormProps {
	initialData?: Partial<BlogPost>;
	onSuccess: () => void;
}

const saveBlogApi = async (data: PostFormData) => {
	const isEdit = Boolean(data.id);
	const endpoint = isEdit ? `/api/kevinadiwiguna/blogs/${data.id}` : "/api/kevinadiwiguna/blogs";
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

export function PostForm({ initialData, onSuccess }: PostFormProps) {
	const queryClient = useQueryClient();
	const [uploading, setUploading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const [formData, setFormData] = useState<PostFormData>({
		id: initialData?.id,
		title: initialData?.title || "",
		slug: initialData?.slug || "",
		excerpt: initialData?.excerpt ?? null,
		content: initialData?.content || "",
		image: initialData?.image ?? null,
		published: initialData?.published ?? false,
		readTime: initialData?.readTime ?? null,
	});

	const { mutate: saveBlog, isPending } = useMutation({
		mutationFn: saveBlogApi,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blogs"] });
			onSuccess();
		},
		onError: (error: Error) => {
			console.error("BLOG_SUBMIT_ERROR:", error);
			alert(error.message || "OPERATION_FAILED");
		},
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
		if (!formData.title.trim()) newErrors.title = "Judul wajib diisi";
		if (!formData.slug.trim()) newErrors.slug = "Slug wajib diisi";
		if (!formData.content.trim()) newErrors.content = "Konten utama wajib diisi";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		saveBlog(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-4">
					<div className="space-y-2">
						<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Entry_Title</label>
						<input name="title" value={formData.title} onChange={handleTitleChange} className="w-full bg-background border border-input rounded-sm p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />
						{errors.title && <p className="text-destructive text-[10px] font-mono">{errors.title}</p>}
					</div>

					<div className="space-y-2">
						<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Post_Slug</label>
						<input name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-background border border-input rounded-sm p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />
						{errors.slug && <p className="text-destructive text-[10px] font-mono">{errors.slug}</p>}
					</div>
				</div>

				<div className="space-y-2">
					<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Header_Media</label>
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
								<span className="text-[10px] font-mono">UPLOAD_HEADER</span>
								<input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
							</label>
						)}
					</div>
					{errors.image && <p className="text-destructive text-[10px] font-mono">{errors.image}</p>}
				</div>
			</div>

			<div className="space-y-2">
				<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Post_Excerpt</label>
				<textarea name="excerpt" value={formData.excerpt || ""} onChange={handleChange} rows={2} className="w-full bg-background border border-input rounded-sm p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />
			</div>

			<div className="space-y-2">
				<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Post_Body</label>
				<Editor
					content={formData.content}
					onChange={(val) => {
						setFormData((prev) => ({ ...prev, content: val }));
						if (errors.content) setErrors((prev) => ({ ...prev, content: "" }));
					}}
				/>
				{errors.content && <p className="text-destructive text-[10px] font-mono">{errors.content}</p>}
			</div>

			<div className="flex items-center justify-between pt-4 border-t border-border">
				<div className="flex items-center gap-2">
					<input type="checkbox" name="published" checked={formData.published} onChange={handleChange} className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-ring" />
					<label className="font-mono text-[10px] text-muted-foreground uppercase">Visible_In_Public_Domain</label>
				</div>

				<button type="submit" disabled={isPending || uploading} className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-mono font-bold rounded-sm hover:bg-primary/90 transition-all disabled:opacity-50">
					{isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
					EXECUTE_PUBLISH
				</button>
			</div>
		</form>
	);
}
