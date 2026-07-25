import { createAuthClient } from "better-auth/react";

const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
        return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
    }
    return "http://localhost:3000";
};

export const authClient = createAuthClient({
    baseURL: getBaseUrl(),
});
