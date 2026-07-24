import { Metadata } from "next";
import { MainForm } from "./components/main-form";
import { getCountExperiences, getAllExperiences } from "@/hooks/kevinadiwiguna/experiences";

export const metadata: Metadata = {
	title: "Experience Management | Kevin Adiwiguna",
	description: "Manage professional experience and work history. Showcase career achievements and technical expertise.",
	keywords: ["experience", "career", "professional", "work history", "Kevin Adiwiguna"],
	openGraph: {
		title: "Experience Management | Kevin Adiwiguna",
		description: "Manage professional experience and work history. Showcase career achievements and technical expertise.",
		type: "website",
	},
};

const Page = async () => {
	const totalExperiences = await getCountExperiences();
	const allExperiences = await getAllExperiences();

	return <MainForm totalExperiences={totalExperiences} allExperiences={allExperiences} />;
};

export default Page;
