"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Loader2, Plus, X } from "lucide-react";

export type ExperienceProps = {
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

type ExperienceFormData = Omit<ExperienceProps, "id" | "createdAt" | "updatedAt"> & {
	id?: string;
};

type ExperienceFormState = {
	id?: string;
	company: string;
	role: string;
	startDate: string;
	endDate: string | null;
	description: string;
	techUsed: string[];
};

interface ExperienceFormProps {
	initialData?: Partial<ExperienceProps>;
	onSuccess: () => void;
}

const saveExperienceApi = async (data: ExperienceFormData) => {
	const isEdit = Boolean(data.id);
	const endpoint = isEdit ? `/api/kevinadiwiguna/experience/${data.id}` : "/api/kevinadiwiguna/experience";
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

export function ExperienceForm({ initialData, onSuccess }: ExperienceFormProps) {
	const queryClient = useQueryClient();
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [techInput, setTechInput] = useState("");

	const formatDateForInput = (date?: Date | string | null): string => {
		if (!date) return "";
		const d = new Date(date);
		return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
	};

	const [formData, setFormData] = useState<ExperienceFormState>({
		id: initialData?.id,
		company: initialData?.company || "",
		role: initialData?.role || "",
		startDate: formatDateForInput(initialData?.startDate),
		endDate: initialData?.endDate ? formatDateForInput(initialData.endDate) : null,
		description: initialData?.description || "",
		techUsed: initialData?.techUsed || [],
	});

	const { mutate: saveExperience, isPending } = useMutation({
		mutationFn: saveExperienceApi,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["experiences"] });
			onSuccess();
		},
		onError: (error: Error) => {
			console.error("EXPERIENCE_SUBMIT_ERROR:", error);
			alert(error.message || "OPERATION_FAILED");
		},
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	// Handlers untuk Tech Used (Chips)
	const addTech = (tech: string) => {
		const trimmed = tech.trim();
		if (trimmed && !formData.techUsed.includes(trimmed)) {
			setFormData((prev) => ({
				...prev,
				techUsed: [...prev.techUsed, trimmed],
			}));
		}
		setTechInput("");
	};

	const removeTech = (tech: string) => {
		setFormData((prev) => ({
			...prev,
			techUsed: prev.techUsed.filter((t) => t !== tech),
		}));
	};

	const validate = () => {
		const newErrors: Record<string, string> = {};
		if (!formData.company.trim()) newErrors.company = "Perusahaan/Organisasi wajib diisi";
		if (!formData.role.trim()) newErrors.role = "Posisi/Role wajib diisi";
		if (!formData.startDate) newErrors.startDate = "Tanggal mulai wajib diisi";
		if (!formData.description.trim()) newErrors.description = "Deskripsi wajib diisi";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		saveExperience({
			...formData,
			startDate: new Date(formData.startDate),
			endDate: formData.endDate ? new Date(formData.endDate) : null,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Organization / Company</label>
					<input name="company" value={formData.company} onChange={handleChange} className="w-full bg-background border border-input rounded-sm p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />
					{errors.company && <p className="text-destructive text-[10px] font-mono">{errors.company}</p>}
				</div>

				<div className="space-y-2">
					<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Professional Role</label>
					<input name="role" value={formData.role} onChange={handleChange} className="w-full bg-background border border-input rounded-sm p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />
					{errors.role && <p className="text-destructive text-[10px] font-mono">{errors.role}</p>}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Start Date</label>
					<input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full bg-background border border-input rounded-sm p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />
					{errors.startDate && <p className="text-destructive text-[10px] font-mono">{errors.startDate}</p>}
				</div>

				<div className="space-y-2">
					<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">End Date (Leave empty if Current)</label>
					<input
						type="date"
						name="endDate"
						value={formData.endDate || ""}
						onChange={(e) => {
							const val = e.target.value;
							setFormData((prev) => ({ ...prev, endDate: val ? val : null }));
						}}
						className="w-full bg-background border border-input rounded-sm p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Core Responsibilities / Description</label>
				<textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-background border border-input rounded-sm p-3 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors" />
				{errors.description && <p className="text-destructive text-[10px] font-mono">{errors.description}</p>}
			</div>

			{/* SECTION: TECHNOLOGIES USED */}
			<div className="space-y-3">
				<label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Technologies Deployed</label>

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
						placeholder="e.g. React, Next.js, PostgreSQL..."
						className="flex-1 bg-background border border-input rounded-sm p-2 font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
					/>
					<button type="button" onClick={() => addTech(techInput)} className="px-3 bg-muted hover:bg-muted/80 text-foreground border border-input rounded-sm transition-colors">
						<Plus size={16} />
					</button>
				</div>

				<div className="flex flex-wrap gap-2 pt-1">
					{formData.techUsed.map((tech) => (
						<span key={tech} className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-sm font-mono text-[11px]">
							{tech}
							<button type="button" onClick={() => removeTech(tech)} className="hover:opacity-70 transition-opacity">
								<X size={12} />
							</button>
						</span>
					))}
				</div>
			</div>

			<div className="pt-4 border-t border-border flex justify-end">
				<button type="submit" disabled={isPending} className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-mono font-bold rounded-sm hover:bg-primary/90 transition-all disabled:opacity-50">
					{isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
					UPDATE_TIMELINE
				</button>
			</div>
		</form>
	);
}
