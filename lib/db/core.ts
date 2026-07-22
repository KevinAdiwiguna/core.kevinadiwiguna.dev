import { PrismaClient } from "@/app/generated/prisma/core/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL_CORE;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const getPrisma = () =>
  new PrismaClient({
    adapter,
  });

const globalForCoreDB = global as unknown as {
  coreDB: ReturnType<typeof getPrisma>;
};

export const coreDB = globalForCoreDB.coreDB || getPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForCoreDB.coreDB = coreDB;
}
