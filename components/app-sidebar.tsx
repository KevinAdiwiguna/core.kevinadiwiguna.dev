import * as React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { coreDB } from "@/lib/db/core";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

import { PROJECT_SIDEBAR_CONFIGS, DEFAULT_SIDEBAR_CONFIG, type SidebarMenuItem } from "@/constant/sidebar";

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const headerList = await headers();
	const pathname = headerList.get("x-pathname") || "";

	const pathSegments = pathname.split("/").filter(Boolean);
	const currentSlug = pathSegments[0] || "";

	const session = await auth.api.getSession({
		headers: headerList,
	});

	if (!session || !session.user) {
		redirect("/login");
	}

	const userProjects = await coreDB.project.findMany({
		where: {
			members: {
				some: {
					userId: session.user.id,
				},
			},
		},
		select: {
			id: true,
			slug: true,
			description: true,
		},
	});

	const projectConfig = PROJECT_SIDEBAR_CONFIGS[currentSlug] || [];
	const combinedConfig = [...DEFAULT_SIDEBAR_CONFIG, ...projectConfig];

	const basePath = `/${currentSlug}`;

	const navMainItems = combinedConfig.map((item: SidebarMenuItem) => ({
		title: item.title,
		url: item.path ? `${basePath}${item.path}` : basePath,
		icon: item.icon,
	}));

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher projects={userProjects} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMainItems} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={session.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
