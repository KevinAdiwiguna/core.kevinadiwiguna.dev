import { MainForm } from "./components/main-form";
import { getBlogsCount, getAllBlogs, getAllTags, getAllCategories } from "@/hooks/kevinadiwiguna/blogs";

const Page = async () => {
	const totalBlogs = await getBlogsCount();
	const allBlogs = await getAllBlogs();
	const tags = await getAllTags();
	const categories = await getAllCategories();

	return <MainForm totalBlogs={totalBlogs} getAllBlogs={allBlogs} tags={tags} categories={categories} />;
};

export default Page;
