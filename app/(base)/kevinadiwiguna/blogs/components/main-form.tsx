"use client";

import { CreateButton } from "./create-button";
import { EditButton, totalBlogsProps } from "./edit-button";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";

import { PostForm } from "./project-form";
import { Modal } from "@/components/modal";
import { useRouter } from "next/navigation";

import { useModal2 } from "@/hooks/use-modal-2";

export const MainForm = ({ totalBlogs, getAllBlogs, tags = [], categories = [] }: { totalBlogs: number; getAllBlogs: totalBlogsProps[]; tags?: Array<{ id: string; name: string }>; categories?: Array<{ id: string; name: string }> }) => {
	const router = useRouter();
	const { isOpen, selectedBlogs, setIsOpen, setSelectedBlogs } = useModal2();

	const handleClose = () => {
		setIsOpen(false);
		setSelectedBlogs(null);
	};

	return (
		<div className="space-y-6">
			<CreateButton totalProjects={totalBlogs} isOpen={setIsOpen} />

			<div className="rounded-md border font-mono text-xs">
				<Table>
					<TableHeader>
						<TableRow className="uppercase tracking-widest text-muted-foreground">
							<TableHead>Title</TableHead>
							<TableHead>Read Time</TableHead>
							<TableHead>Views</TableHead>
							<TableHead>Created_At</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{getAllBlogs.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} className="h-24 text-center italic text-muted-foreground">
									NO_RECORDS_FOUND
								</TableCell>
							</TableRow>
						) : (
							getAllBlogs.map((blog) => (
								<TableRow key={blog.id}>
									<TableCell>
										<div className="flex flex-col">
											<span className="font-bold text-foreground">{blog.title}</span>
											<span className="text-[10px] text-muted-foreground">/{blog.slug}</span>
										</div>
									</TableCell>

									<TableCell className="text-muted-foreground">{blog.readTime} min</TableCell>
									<TableCell className="text-muted-foreground">{blog.views}</TableCell>

									<TableCell className="text-muted-foreground">{new Date(blog.createdAt).toLocaleDateString()}</TableCell>

									<TableCell className="text-right">
										<EditButton setIsOpen={setIsOpen} blog={blog} setSelectedBlogs={setSelectedBlogs} />
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<Modal isOpen={isOpen} onClose={handleClose} title={selectedBlogs ? "EDIT_BLOG" : "INITIALIZE_BLOG"} size="xl">
				<PostForm
					initialData={
						selectedBlogs
							? {
									title: selectedBlogs.title,
									image: selectedBlogs.image,
									id: selectedBlogs.id,
									slug: selectedBlogs.slug,
									content: selectedBlogs.content,
									excerpt: selectedBlogs.excerpt,
									published: selectedBlogs.published,
									readTime: selectedBlogs.readTime,
									views: selectedBlogs.views,
									tags: selectedBlogs.tags,
									categories: selectedBlogs.categories,
								}
							: undefined
					}
					tags={tags}
					categories={categories}
					onSuccess={() => {
						handleClose();
						router.refresh();
					}}
				/>
			</Modal>
		</div>
	);
};
