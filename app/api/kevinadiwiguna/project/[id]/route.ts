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
        const { title, slug, shortDescription, content, image, githubUrl, liveUrl, isFeatured, status } = body;

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
