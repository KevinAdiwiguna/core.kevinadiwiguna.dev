export interface SidebarMenuItem {
    title: string;
    path: string;
    icon: string;
}

export const PROJECT_SIDEBAR_CONFIGS: Record<string, SidebarMenuItem[]> = {
    "kevinadiwiguna": [
        { title: "Projects", path: "/projects", icon: "LayoutDashboard" },
        { title: "Blogs", path: "/blogs", icon: "FileText" },
        { title: "Experience", path: "/experience", icon: "FileText" },
    ],
    "project-dua": [
        { title: "Settings", path: "/settings", icon: "Settings" },
        { title: "Projects", path: "/projects", icon: "FolderGit2" },
        { title: "User", path: "/users", icon: "Users" },
    ],
};

export const DEFAULT_SIDEBAR_CONFIG: SidebarMenuItem[] = [
    { title: "Overview", path: "", icon: "LayoutDashboard" },
];
