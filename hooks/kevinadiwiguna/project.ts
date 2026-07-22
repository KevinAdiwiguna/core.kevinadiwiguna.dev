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
