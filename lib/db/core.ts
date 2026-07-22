import { PrismaClient } from "@/app/generated/prisma/core/client";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({
  connectionString: process.env.PPG_USER_DATABASE_URL,
});
const getPrisma = () =>
  new PrismaClient({
    adapter,
  });
const globalForUserDBPrismaClient = global as unknown as {
  userDBPrismaClient: ReturnType<typeof getPrisma>;
};
export const coreDB = globalForUserDBPrismaClient.userDBPrismaClient || getPrisma(); // [!code ++]
if (process.env.NODE_ENV !== "production")
  globalForUserDBPrismaClient.userDBPrismaClient = coreDB;
