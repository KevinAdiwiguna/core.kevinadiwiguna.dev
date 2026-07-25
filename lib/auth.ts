import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { coreDB } from "@/lib/db/core";


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
