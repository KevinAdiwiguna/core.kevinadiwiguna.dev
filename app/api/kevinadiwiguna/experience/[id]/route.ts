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
		headers: await headers(),
	});

	if (!session) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const { id } = await params;
		const body = await req.json();
		const { company, role, startDate, endDate, description, techUsed } = body;

		const existingExperience = await kevinadiwigunaDB.experience.findUnique({
			where: { id },
		});

		if (!existingExperience) {
			return NextResponse.json(
				{ message: "Experience record not found" },
				{ status: 404 }
			);
		}

		const updatedExperience = await kevinadiwigunaDB.experience.update({
			where: { id },
			data: {
				company: company ?? existingExperience.company,
				role: role ?? existingExperience.role,
				startDate: startDate ? new Date(startDate) : existingExperience.startDate,
				endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : existingExperience.endDate,
				description: description ?? existingExperience.description,
				techUsed: techUsed !== undefined ? (Array.isArray(techUsed) ? techUsed : []) : existingExperience.techUsed,
			},
		});

		revalidatePath("/kevinadiwiguna/experience");

		return NextResponse.json(updatedExperience, { status: 200 });
	} catch (error) {
		console.error("[EXPERIENCE_PUT_ERROR]", error);
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

		const existingExperience = await kevinadiwigunaDB.experience.findUnique({
			where: { id },
		});

		if (!existingExperience) {
			return NextResponse.json(
				{ message: "Experience record not found" },
				{ status: 404 }
			);
		}

		await kevinadiwigunaDB.experience.delete({
			where: { id },
		});

		revalidatePath("/kevinadiwiguna/experience");

		return NextResponse.json(
			{ message: "Experience deleted successfully" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("[EXPERIENCE_DELETE_ERROR]", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
