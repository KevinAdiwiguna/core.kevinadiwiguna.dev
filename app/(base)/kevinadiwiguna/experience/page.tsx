import { MainForm } from "./components/main-form";
import { getCountExperiences, getAllExperiences } from "@/hooks/kevinadiwiguna/experiences";

const Page = async () => {
	const totalExperiences = await getCountExperiences();
	const allExperiences = await getAllExperiences();

	return <MainForm totalExperiences={totalExperiences} allExperiences={allExperiences} />;
};

export default Page;
