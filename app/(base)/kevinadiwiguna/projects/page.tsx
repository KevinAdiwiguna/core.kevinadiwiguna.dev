import { getTotalProject, getAllProject } from "@/hooks/kevinadiwiguna/project";
import { MainForm } from "./components/main-form";

const Page = async () => {
	const totalProjects = await getTotalProject();
	const getAllProjects = await getAllProject();

	return <MainForm totalProjects={totalProjects} getAllProjects={getAllProjects} />;
};

export default Page;
