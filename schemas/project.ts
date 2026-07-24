import z from "zod";

export const projectSchema = z.object({
    title: z.string().min(3),
    slug: z.string().min(3),
    shortDescription: z.string().max(200),
    content: z.string().min(1),
    image: z.string().optional().or(z.literal("")),
    githubUrl: z.string().optional().or(z.literal("")).or(z.null()),
    liveUrl: z.string().optional().or(z.literal("")).or(z.null()),
    isFeatured: z.boolean().default(false),
    status: z.enum(["ONGOING", "COMPLETED"]),
});
