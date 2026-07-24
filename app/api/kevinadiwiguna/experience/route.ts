import { NextResponse } from "next/server";
import { kevinadiwigunaDB } from "@/lib/db/kevinadiwiguna";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

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
		const experiences = await kevinadiwigunaDB.experience.findMany({
			orderBy: {
				startDate: "desc",
			},
		});

		revalidatePath("/kevinadiwiguna/experience");
		return NextResponse.json(experiences, { status: 200 });
	} catch (error) {
		console.error("[EXPERIENCE_GET_ERROR]", error);
		return NextResponse.json(
			{ message: "Failed to fetch experiences" },
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
		const { company, role, startDate, endDate, description, techUsed = [] } = body;

		if (!company || !role || !startDate || !description) {
			return NextResponse.json(
				{ message: "Missing required fields (company, role, startDate, description)" },
				{ status: 400 }
			);
		}

		const experience = await kevinadiwigunaDB.experience.create({
			data: {
				company,
				role,
				startDate: new Date(startDate),
				endDate: endDate ? new Date(endDate) : null,
				description,
				techUsed: Array.isArray(techUsed) ? techUsed : [],
			},
		});

		revalidatePath("/kevinadiwiguna/experience");
		return NextResponse.json(experience, { status: 201 });
	} catch (error) {
		console.error("[EXPERIENCE_POST_ERROR]", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
