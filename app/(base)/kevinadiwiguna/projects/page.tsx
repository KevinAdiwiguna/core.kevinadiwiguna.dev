import { getTotalProject, getAllProject, getAllTech } from "@/hooks/kevinadiwiguna/project";
import { MainForm } from "./components/main-form";
import { getAllCategories } from "@/hooks/kevinadiwiguna/blogs";

const Page = async () => {
	const totalProjects = await getTotalProject();
	const getAllProjects = await getAllProject();
	const categories = await getAllCategories();
	const tech = await getAllTech();

	return <MainForm technologies={tech} categories={categories} totalProjects={totalProjects} getAllProjects={getAllProjects} />;
};

export default Page;
