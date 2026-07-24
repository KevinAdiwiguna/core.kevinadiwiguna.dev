"use client";

import * as React from "react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { ChevronsUpDownIcon } from "lucide-react";

export function TeamSwitcher({
	projects,
}: {
	projects: {
		slug: string;
		id: string;
		description: string | null;
		logo?: string;
	}[];
}) {
	const { isMobile } = useSidebar();
	const [activeTeam, setActiveTeam] = React.useState(projects[0]);
	if (!activeTeam) {
		return null;
	}
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground" />}>
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">{activeTeam.logo}</div>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{activeTeam.slug}</span>
							<span className="truncate text-xs">{activeTeam.description}</span>
						</div>
						<ChevronsUpDownIcon className="ml-auto" />
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-fit" align="start" side={isMobile ? "bottom" : "right"} sideOffset={4}>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
							{projects.map((project, index) => (
								<DropdownMenuItem key={project.slug} onClick={() => setActiveTeam(project)} className="gap-2 p-2">
									<div className="flex size-6 items-center justify-center rounded-md border">{project.logo}</div>
									{project.slug}
									<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
