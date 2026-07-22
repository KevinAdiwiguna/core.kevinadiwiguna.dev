import { coreDB } from "@/lib/db/core";
import { hashPassword } from "better-auth/crypto";

async function main() {
    console.log("🌱 Seeding Core Database...");

    await coreDB.projectMember.deleteMany();
    await coreDB.project.deleteMany();
    await coreDB.account.deleteMany();
    await coreDB.session.deleteMany();
    await coreDB.user.deleteMany();

    const user = await coreDB.user.create({
        data: {
            name: "Kevin Adiwiguna",
            email: "me@kevinadiwiguna.dev",
            emailVerified: true,
            image: "https://github.com/shadcn.png",
        },
    });

    console.log(`👤 User created: ${user.name} (${user.id})`);

    const hashedPassword = await hashPassword("Password123#");

    await coreDB.account.create({
        data: {
            userId: user.id,
            accountId: user.email,
            providerId: "credential",
            password: hashedPassword,
        },
    });

    console.log("🔑 Account credential (password: Password123#) created successfully!");

    const project = await coreDB.project.create({
        data: {
            slug: "kevinadiwiguna",
            description: "Personal Portfolio & Blog Management",
            icon: "Code2Icon",
            status: "ACTIVE",
            members: {
                create: {
                    userId: user.id,
                    role: "OWNER",
                },
            },
        },
    });

    console.log(`🚀 Project created: ${project.slug} (${project.id})`);
    console.log("✅ Seeding finished successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await coreDB.$disconnect();
    });
