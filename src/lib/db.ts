import { neon } from "@neondatabase/serverless";

// Use fallback: if DATABASE_URL_UNPOOLED is defined then use that else use DATABASE_URL.
const connectionString =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Database connection string is not defined.");
}

const sql = neon(connectionString);

export default sql;
