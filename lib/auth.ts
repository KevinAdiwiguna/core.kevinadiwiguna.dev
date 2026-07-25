import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { coreDB } from "@/lib/db/core";
import type { AuthContext } from "better-auth";

const WHITELISTED_EMAILS = [
    "adiwigunakevin@gmail.com",
    "f1d02410115@student.unram.ac.id",
];

const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
        return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
    }
    return "http://localhost:3000";
};

export const auth = betterAuth({
    database: prismaAdapter(coreDB, {
        provider: "postgresql",
    }),
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    if (!WHITELISTED_EMAILS.includes(user.email)) {
                        throw new APIError("FORBIDDEN", {
                            message: "EMAIL_NOT_WHITELISTED",
                        });
                    }
                },
            },
        },
    },
    onAPIError: {
        throw: true,
        onError: async (error: unknown, ctx: AuthContext) => {
            if (error instanceof APIError && error.message === "EMAIL_NOT_WHITELISTED") {
                if ("redirect" in ctx && typeof ctx.redirect === "function") {
                    throw ctx.redirect("/not-whitelisted");
                }

                throw new APIError("FOUND", {
                    message: "Redirecting to /not-whitelisted",
                    headers: {
                        Location: "/not-whitelisted",
                    },
                });
            }
        },
    },
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: getBaseUrl(),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

});
