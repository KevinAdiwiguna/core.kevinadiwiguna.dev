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

export async function GET() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return NextResponse.json(
			{ message: "Unauthorized" },
			{ status: 401 }
		);
	}

	try {
		const blogs = await kevinadiwigunaDB.blogs.findMany({
			orderBy: {
				createdAt: "desc",
			},
			include: {
				tags: true,
				categories: true,
			},
		});

		revalidatePath("/kevinadiwiguna/blogs");
		return NextResponse.json(blogs, { status: 200 });
	} catch (error) {
		console.error("[BLOGS_GET_ERROR]", error);
		return NextResponse.json(
			{ message: "Failed to fetch blogs" },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return NextResponse.json(
			{ message: "Unauthorized" },
			{ status: 401 }
		);
	}

	try {
		const body = await req.json();
		const { title, slug, content, excerpt, image, published, readTime, tagNames = "", categoryNames = "" } = body;

		if (!title || !slug || !content) {
			return NextResponse.json(
				{ message: "Missing required fields (title, slug, content)" },
				{ status: 400 }
			);
		}

		const existingBlog = await kevinadiwigunaDB.blogs.findUnique({
			where: { slug },
		});

		if (existingBlog) {
			return NextResponse.json(
				{ message: "Slug already exists. Please choose another slug." },
				{ status: 400 }
			);
		}

		const calculatedReadTime = readTime ?? calculateReadTime(content);

		const parseNames = (input: string): string[] => {
			return input
				.split(",")
				.map((name) => name.trim())
				.filter((name) => name.length > 0);
		};

		const tagNameList = parseNames(tagNames);
		const categoryNameList = parseNames(categoryNames);

		const blog = await kevinadiwigunaDB.blogs.create({
			data: {
				title,
				slug,
				content,
				excerpt: excerpt || "",
				image: image || null,
				published: Boolean(published),
				readTime: calculatedReadTime,
				tags: {
					connectOrCreate: tagNameList.map((name) => ({
						where: { name },
						create: { name },
					})),
				},
				categories: {
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
		return NextResponse.json(blog, { status: 201 });
	} catch (error) {
		console.error("[BLOGS_POST_ERROR]", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
