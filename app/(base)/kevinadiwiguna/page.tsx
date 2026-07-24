import { Metadata } from "next";
import DashboardOverview from "@/components/kevinadiwiguna/dashboard";

export const metadata: Metadata = {
	title: "Dashboard | Kevin Adiwiguna",
	description: "Personal portfolio and admin dashboard. Explore my professional experience, blog posts, and technical projects.",
	keywords: ["Kevin Adiwiguna", "developer", "portfolio", "blog"],
	openGraph: {
		title: "Dashboard | Kevin Adiwiguna",
		description: "Personal portfolio and admin dashboard. Explore my professional experience, blog posts, and technical projects.",
		type: "website",
	},
};

export default async function Page() {
	return (
		<>
			<DashboardOverview />
		</>
	);
}
