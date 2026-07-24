import { Metadata } from "next";
import { MainForm } from "./components/main-form";
import { getBlogsCount, getAllBlogs, getAllTags, getAllCategories } from "@/hooks/kevinadiwiguna/blogs";

export const metadata: Metadata = {
	title: "Blog Management | Kevin Adiwiguna",
	description: "Manage and publish blog posts about web development, technology, and software engineering.",
	keywords: ["blog", "articles", "technology", "web development", "Kevin Adiwiguna"],
	openGraph: {
		title: "Blog Management | Kevin Adiwiguna",
		description: "Manage and publish blog posts about web development, technology, and software engineering.",
		type: "website",
	},
};

const Page = async () => {
	const totalBlogs = await getBlogsCount();
	const allBlogs = await getAllBlogs();
	const tags = await getAllTags();
	const categories = await getAllCategories();

	return <MainForm totalBlogs={totalBlogs} getAllBlogs={allBlogs} tags={tags} categories={categories} />;
};

export default Page;
