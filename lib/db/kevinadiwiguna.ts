import { PrismaClient } from "@/app/generated/prisma/kevinadiwiguna/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL_KEVINADIWIGUNA;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const getPrisma = () =>
  new PrismaClient({
    adapter,
  });

const globalForKevinDB = global as unknown as {
  kevinadiwigunaDB: ReturnType<typeof getPrisma>;
};

export const kevinadiwigunaDB =
  globalForKevinDB.kevinadiwigunaDB || getPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForKevinDB.kevinadiwigunaDB = kevinadiwigunaDB;
}
