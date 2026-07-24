import { kevinadiwigunaDB } from "@/lib/db/kevinadiwiguna";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getAllViewBlogs = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        throw new Error("Unauthorized");
    }
    const blogs = await kevinadiwigunaDB.blogs.findMany({
        select: {
            views: true,
        },
    });
    return blogs.reduce((acc, blog) => acc + blog.views, 0);
};

export const getBlogsCount = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        throw new Error("Unauthorized");
    }

    const count = await kevinadiwigunaDB.blogs.count();

    return count;
};

export const getAllBlogs = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        throw new Error("Unauthorized");
    }

    const blog = await kevinadiwigunaDB.blogs.findMany({
    });

    return blog;
}
