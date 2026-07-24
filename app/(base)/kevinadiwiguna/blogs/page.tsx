import { MainForm } from "./components/main-form";
import { getBlogsCount, getAllBlogs } from "@/hooks/kevinadiwiguna/blogs";

const Page = async () => {
	const totalBlogs = await getBlogsCount();
	const allBlogs = await getAllBlogs();

	return <MainForm totalBlogs={totalBlogs} getAllBlogs={allBlogs} />;
};

export default Page;
