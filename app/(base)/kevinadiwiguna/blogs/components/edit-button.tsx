"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export type totalBlogsProps = {
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
	tags?: Array<{ id: string; name: string }>;
	categories?: Array<{ id: string; name: string }>;
};

interface EditButtonProps {
	blog: totalBlogsProps;
	setSelectedBlogs: (blogs: totalBlogsProps) => void;
	setIsOpen: (open: boolean) => void;
}

export const EditButton = ({ blog, setSelectedBlogs, setIsOpen }: EditButtonProps) => {
	const handleEdit = () => {
		setSelectedBlogs(blog);
		setIsOpen(true);
	};

	return (
		<Button variant="ghost" size="icon" onClick={handleEdit} className="h-8 w-8 text-muted-foreground hover:text-foreground">
			<Pencil className="h-4 w-4" />
			<span className="sr-only">Edit Blog</span>
		</Button>
	);
};
