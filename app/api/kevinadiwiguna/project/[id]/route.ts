import { NextResponse } from "next/server";
import { kevinadiwigunaDB } from "@/lib/db/kevinadiwiguna";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const {
            title,
            slug,
            shortDescription,
            content,
            image,
            githubUrl,
            liveUrl,
            isFeatured,
            status,
            techNames,
            categoryNames,
        } = body;

        const existingProject = await kevinadiwigunaDB.project.findUnique({
            where: { id },
        });

        if (!existingProject) {
            return NextResponse.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }

        if (slug && slug !== existingProject.slug) {
            const slugCheck = await kevinadiwigunaDB.project.findUnique({
                where: { slug },
            });

            if (slugCheck) {
                return NextResponse.json(
                    { message: "Slug is already used by another project" },
                    { status: 400 }
                );
            }
        }

        const parsedTechs = typeof techNames === "string"
            ? techNames.split(",").map((t) => t.trim()).filter(Boolean)
            : [];

        const parsedCategories = typeof categoryNames === "string"
            ? categoryNames.split(",").map((c) => c.trim()).filter(Boolean)
            : [];

        const updatedProject = await kevinadiwigunaDB.project.update({
            where: { id },
            data: {
                title: title ?? existingProject.title,
                slug: slug ?? existingProject.slug,
                shortDescription: shortDescription ?? existingProject.shortDescription,
                content: content ?? existingProject.content,
                image: image !== undefined ? image : existingProject.image,
                githubUrl: githubUrl !== undefined ? githubUrl : existingProject.githubUrl,
                liveUrl: liveUrl !== undefined ? liveUrl : existingProject.liveUrl,
                isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existingProject.isFeatured,
                status: status ?? existingProject.status,

                technologies: {
                    set: [],
                    connectOrCreate: parsedTechs.map((name) => ({
                        where: { name },
                        create: { name },
                    })),
                },

                categories: {
                    set: [],
                    connectOrCreate: parsedCategories.map((name) => ({
                        where: { name },
                        create: { name },
                    })),
                },
            },
            include: {
                technologies: true,
                categories: true,
            },
        });

        revalidatePath("/kevinadiwiguna/projects");

        return NextResponse.json(updatedProject, { status: 200 });
    } catch (error) {
        console.error("[PROJECT_PUT_ERROR]", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        const existingProject = await kevinadiwigunaDB.project.findUnique({
            where: { id },
        });

        if (!existingProject) {
            return NextResponse.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }

        await kevinadiwigunaDB.project.delete({
            where: { id },
        });

        revalidatePath("/kevinadiwiguna/projects");

        return NextResponse.json(
            { message: "Project deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("[PROJECT_DELETE_ERROR]", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
