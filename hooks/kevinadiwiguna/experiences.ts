import { kevinadiwigunaDB } from "@/lib/db/kevinadiwiguna"
import { auth } from "@/lib/auth"
import { headers } from "next/headers";

export const getAllExperiences = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new Error("Unauthorized");
    }
    const experiences = await kevinadiwigunaDB.experience.findMany()
    return experiences
}
export const getCountExperiences = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) {
        throw new Error("Unauthorized");
    }
    const experiencesCount = await kevinadiwigunaDB.experience.count()
    return experiencesCount
}
