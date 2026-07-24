"use client"
import { useState } from "react";

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
};


export const useModal2 = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedBlogs, setSelectedBlogs] = useState<totalBlogsProps | null>(null);

	return { isOpen, setIsOpen, selectedBlogs, setSelectedBlogs };
};
