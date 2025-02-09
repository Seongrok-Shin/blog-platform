import { neon } from "@neondatabase/serverless";

// Use the unpooled connection string to correctly access the "users" table on Neon.
const sql = neon(`${process.env.DATABASE_URL_UNPOOLED}`);

export default sql;
