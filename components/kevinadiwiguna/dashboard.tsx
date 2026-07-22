import { Eye, FolderCode, FileText } from "lucide-react";
import { getAllViewBlogs, getBlogsCount } from "@/hooks/kevinadiwiguna/blogs";
import { getTotalProject } from "@/hooks/kevinadiwiguna/project";
import { OverviewCharts } from "@/components/overview-charts";

export default async function DashboardOverview() {
	const allViewBlogsCount = await getAllViewBlogs();
	const viewBlogsCount = await getBlogsCount();
	const countAllProjects = await getTotalProject();

	const stats = [
		{
			title: "TOTAL_VIEWS",
			value: allViewBlogsCount,
			icon: Eye,
			iconColor: "text-amber-500",
		},
		{
			title: "PROJECT_COUNT",
			value: countAllProjects,
			icon: FolderCode,
			iconColor: "text-blue-500",
		},
		{
			title: "BLOG_ENTRIES",
			value: viewBlogsCount,
			icon: FileText,
			iconColor: "text-emerald-500",
		},
	];

	return (
		<section className="bg-background text-foreground p-8 min-h-screen font-mono">
			<div className="mb-8">
				<h1 className="text-3xl font-extrabold tracking-wider text-foreground">SYSTEM_OVERVIEW</h1>
				<p className="text-muted-foreground text-sm mt-1">Real-time status of portfolio infrastructure.</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				{stats.map((item) => {
					const Icon = item.icon;
					return (
						<div key={item.title} className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between h-36 transition-colors hover:border-ring/50">
							<div className="flex items-center justify-between">
								<span className="text-xs tracking-wider text-muted-foreground font-semibold">{item.title}</span>
								<Icon className={`w-5 h-5 ${item.iconColor}`} />
							</div>

							<div>
								<span className="text-3xl font-bold tracking-tight text-card-foreground">{item.value}</span>
							</div>
						</div>
					);
				})}
			</div>

			<OverviewCharts projectCount={countAllProjects} blogCount={viewBlogsCount} totalViews={allViewBlogsCount} />
		</section>
	);
}
