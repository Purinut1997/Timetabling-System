import pkg from "pg";

const { Client } = pkg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required.");
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

const tables = await client.query(
  "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
);
const users = await client.query("SELECT email, role, status FROM users ORDER BY id LIMIT 5");

console.log("tables:", tables.rows.map((row) => row.table_name).join(", "));
console.log("users:", JSON.stringify(users.rows));

await client.end();
