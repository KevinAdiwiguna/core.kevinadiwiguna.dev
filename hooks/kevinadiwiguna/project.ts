import { ProjectStatus } from "@/app/generated/prisma/kevinadiwiguna/browser";
import { auth } from "@/lib/auth";
import { kevinadiwigunaDB } from "@/lib/db/kevinadiwiguna";
import { headers } from "next/headers";

export const getTotalProject = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        throw new Error("Unauthorized");
    }

    const count = await kevinadiwigunaDB.project.count();

    return count;
}

export const getAllProject = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        throw new Error("Unauthorized");
    }

    const projects = await kevinadiwigunaDB.project.findMany({
        orderBy: {
            createdAt: "desc"
        },
        select: {
            title: true,
            image: true,
            id: true,
            slug: true,
            shortDescription: true,
            content: true,
            githubUrl: true,
            liveUrl: true,
            isFeatured: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            categories: {
                select: {
                    name: true,
                    id: true
                }
            },
            technologies: {
                select: {
                    name: true,
                    id: true
                }
            },
        }
    });
    return projects;
}

export const getAllTech = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        throw new Error("Unauthorized");
    }

    const tech = await kevinadiwigunaDB.technology.findMany({
        orderBy: {
            name: "asc"
        }
    });

    return tech;
}
