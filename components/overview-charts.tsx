"use client";

import { Pie, PieChart, Label, RadialBarChart, RadialBar, PolarGrid, PolarRadiusAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface OverviewChartsProps {
	projectCount: number;
	blogCount: number;
	totalViews: number;
}

export function OverviewCharts({ projectCount, blogCount, totalViews }: OverviewChartsProps) {
	const totalContent = projectCount + blogCount;

	const contentData = [
		{ category: "projects", count: projectCount, fill: "var(--color-projects)" },
		{ category: "blogs", count: blogCount, fill: "var(--color-blogs)" },
	];

	const contentChartConfig = {
		count: {
			label: "Items",
		},
		projects: {
			label: "Projects",
			color: "hsl(var(--chart-1))",
		},
		blogs: {
			label: "Blog Posts",
			color: "hsl(var(--chart-2))",
		},
	} satisfies ChartConfig;

	const radialData = [{ metric: "views", value: totalViews, fill: "var(--color-views)" }];

	const radialChartConfig = {
		views: {
			label: "Total Views",
			color: "hsl(var(--chart-3))",
		},
	} satisfies ChartConfig;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
			<Card className="flex flex-col border-border bg-card font-mono">
				<CardHeader className="items-center pb-0">
					<CardTitle className="text-sm font-bold tracking-wider">CONTENT_DISTRIBUTION</CardTitle>
					<CardDescription className="text-xs">Projects vs Blog Entries Ratio</CardDescription>
				</CardHeader>
				<CardContent className="flex-1 pb-0">
					<ChartContainer config={contentChartConfig} className="mx-auto aspect-square max-h-55">
						<PieChart>
							<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
							<Pie data={contentData} dataKey="count" nameKey="category" innerRadius={60} strokeWidth={5}>
								<Label
									content={({ viewBox }) => {
										if (viewBox && "cx" in viewBox && "cy" in viewBox) {
											return (
												<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
													<tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
														{totalContent.toLocaleString()}
													</tspan>
													<tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-xs">
														TOTAL_ITEMS
													</tspan>
												</text>
											);
										}
									}}
								/>
							</Pie>
						</PieChart>
					</ChartContainer>
				</CardContent>
			</Card>

			<Card className="flex flex-col border-border bg-card font-mono">
				<CardHeader className="items-center pb-0">
					<CardTitle className="text-sm font-bold tracking-wider">TRAFFIC_GAUGE</CardTitle>
					<CardDescription className="text-xs">Accumulated Reader Interactions</CardDescription>
				</CardHeader>
				<CardContent className="flex-1 pb-0">
					<ChartContainer config={radialChartConfig} className="mx-auto aspect-square max-h-55">
						<RadialBarChart data={radialData} startAngle={180} endAngle={0} innerRadius={70} outerRadius={100}>
							<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="metric" />} />
							<PolarGrid gridType="circle" radialLines={false} stroke="none" className="first:fill-muted last:fill-background" />
							<RadialBar dataKey="value" background cornerRadius={10} />
							<PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
								<Label
									content={({ viewBox }) => {
										if (viewBox && "cx" in viewBox && "cy" in viewBox) {
											return (
												<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
													<tspan x={viewBox.cx} y={(viewBox.cy || 0) - 10} className="fill-foreground text-2xl font-bold">
														{totalViews.toLocaleString()}
													</tspan>
													<tspan x={viewBox.cx} y={(viewBox.cy || 0) + 12} className="fill-muted-foreground text-xs">
														TOTAL_VIEWS
													</tspan>
												</text>
											);
										}
									}}
								/>
							</PolarRadiusAxis>
						</RadialBarChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
}
