import { Pool } from "pg";
type TPool = InstanceType<typeof Pool>;
// In development, attach the pool instance to the global object to preserve it.
const globalForPool = global as unknown as { pool?: TPool };
const pool =
  globalForPool.pool ||
  new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPool.pool = pool;
}
export default pool;
