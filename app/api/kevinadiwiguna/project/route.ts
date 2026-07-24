import { NextResponse } from "next/server";
import { kevinadiwigunaDB } from "@/lib/db/kevinadiwiguna";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const projects = await kevinadiwigunaDB.project.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                technologies: true,
                categories: true,
            },
        });
        revalidatePath("/kevinadiwiguna/projects");
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error("[PROJECT_GET_ERROR]", error);
        return NextResponse.json(
            { message: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const body = await req.json();
        const { title, slug, shortDescription, content, image, githubUrl, liveUrl, isFeatured, status } = body;

        if (!title || !slug || !shortDescription || !content) {
            return NextResponse.json(
                { message: "Missing required fields (title, slug, shortDescription, content)" },
                { status: 400 }
            );
        }

        const existingProject = await kevinadiwigunaDB.project.findUnique({
            where: { slug },
        });

        if (existingProject) {
            return NextResponse.json(
                { message: "Slug already exists. Please choose another slug." },
                { status: 400 }
            );
        }

        const project = await kevinadiwigunaDB.project.create({
            data: {
                title,
                slug,
                shortDescription,
                content,
                image: image || null,
                githubUrl: githubUrl || null,
                liveUrl: liveUrl || null,
                isFeatured: Boolean(isFeatured),
                status: status || "COMPLETED",
            },
        });

        revalidatePath("/kevinadiwiguna/projects");
        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error("[PROJECT_POST_ERROR]", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
