import { NextResponse } from "next/server";
import { kevinadiwigunaDB } from "@/lib/db/kevinadiwiguna";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

function calculateReadTime(content: string): number {
	const wordsPerMinute = 200;
	const words = content.trim().split(/\s+/).length;
	return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export async function PUT(
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
		const body = await req.json();
		const { title, slug, content, excerpt, image, published, readTime, tagNames = "", categoryNames = "" } = body;

		const existingBlog = await kevinadiwigunaDB.blogs.findUnique({
			where: { id },
		});

		if (!existingBlog) {
			return NextResponse.json(
				{ message: "Blog not found" },
				{ status: 404 }
			);
		}

		if (slug && slug !== existingBlog.slug) {
			const slugCheck = await kevinadiwigunaDB.blogs.findUnique({
				where: { slug },
			});

			if (slugCheck) {
				return NextResponse.json(
					{ message: "Slug is already used by another blog post" },
					{ status: 400 }
				);
			}
		}

		const updatedContent = content ?? existingBlog.content;
		const calculatedReadTime =
			readTime !== undefined
				? readTime
				: content
					? calculateReadTime(content)
					: existingBlog.readTime;

		const parseNames = (input: string): string[] => {
			return input
				.split(",")
				.map((name) => name.trim())
				.filter((name) => name.length > 0);
		};

		const tagNameList = parseNames(tagNames);
		const categoryNameList = parseNames(categoryNames);

		const updatedBlog = await kevinadiwigunaDB.blogs.update({
			where: { id },
			data: {
				title: title ?? existingBlog.title,
				slug: slug ?? existingBlog.slug,
				content: updatedContent,
				excerpt: excerpt !== undefined ? excerpt : existingBlog.excerpt,
				image: image !== undefined ? image : existingBlog.image,
				published: published !== undefined ? Boolean(published) : existingBlog.published,
				readTime: calculatedReadTime,
				tags: {
					set: [],
					connectOrCreate: tagNameList.map((name) => ({
						where: { name },
						create: { name },
					})),
				},
				categories: {
					set: [],
					connectOrCreate: categoryNameList.map((name) => ({
						where: { name },
						create: { name },
					})),
				},
			},
			include: {
				tags: true,
				categories: true,
			},
		});

		revalidatePath("/kevinadiwiguna/blogs");

		return NextResponse.json(updatedBlog, { status: 200 });
	} catch (error) {
		console.error("[BLOGS_PUT_ERROR]", error);
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

		const existingBlog = await kevinadiwigunaDB.blogs.findUnique({
			where: { id },
		});

		if (!existingBlog) {
			return NextResponse.json(
				{ message: "Blog not found" },
				{ status: 404 }
			);
		}

		await kevinadiwigunaDB.blogs.delete({
			where: { id },
		});

		revalidatePath("/kevinadiwiguna/blogs");

		return NextResponse.json(
			{ message: "Blog deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("[BLOGS_DELETE_ERROR]", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
