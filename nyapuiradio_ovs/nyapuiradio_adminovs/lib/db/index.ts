import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  sqlClient?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.sqlClient ??
  postgres(process.env.DATABASE_URL!, {
    max: 10,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.sqlClient = client;
}

export const db = drizzle(client, { schema });
