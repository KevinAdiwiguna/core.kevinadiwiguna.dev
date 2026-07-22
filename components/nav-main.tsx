"use client";

import Link from "next/link";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { FileText, FolderGit2, HelpCircle, LayoutDashboard, Settings, Users, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
	LayoutDashboard,
	FileText,
	Settings,
	FolderGit2,
	Users,
};

export interface NavMainItem {
	title: string;
	url: string;
	icon: string;
	isActive?: boolean;
}

export function NavMain({ items }: { items: NavMainItem[] }) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Menu</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					const IconComponent = iconMap[item.icon] || HelpCircle;
					return (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
								<Link href={item.url} className="flex justify-center items-center gap-x-4">
									{item.icon && <IconComponent className="h-4 w-4" />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
