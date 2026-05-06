import fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import pkg from "pg";

const { Client } = pkg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required.");
}

const schemaPath = path.resolve(process.cwd(), "database/schema.sql");
const schemaSql = await fs.readFile(schemaPath, "utf-8");

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  await client.connect();
  await client.query("BEGIN");
  await client.query(schemaSql);

  const defaultSchoolName = "Default Demo School";
  const schoolRes = await client.query(
    "INSERT INTO schools (name, address, contact_email) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING id",
    [defaultSchoolName, "Bangkok, Thailand", "contact@demo-school.local"],
  );

  let schoolId = schoolRes.rows[0]?.id;
  if (!schoolId) {
    const existingSchool = await client.query("SELECT id FROM schools WHERE name = $1 LIMIT 1", [defaultSchoolName]);
    schoolId = existingSchool.rows[0]?.id;
  }

  const adminPasswordHash = await bcrypt.hash("admin", 12);
  await client.query(
    `
    INSERT INTO users (full_name, email, password_hash, role, status, school_id)
    VALUES ('System Super Admin', 'admin@timetabling.local', $1, 'super_admin', 'active', $2)
    ON CONFLICT (email)
    DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'super_admin', status = 'active', updated_at = NOW()
    `,
    [adminPasswordHash, schoolId],
  );

  await client.query(
    `
    INSERT INTO system_contents (key, value)
    VALUES
      ('home_announcement', 'Welcome to the Timetabling System.'),
      ('contact_info', 'support@timetabling.local | +66-000-0000'),
      ('privacy_policy', 'User data is protected and used only for timetable operations.'),
      ('about', 'High-performance timetable and substitution management platform.'),
      ('system_config', '{"periods":9,"school_days":["Mon","Tue","Wed","Thu","Fri"],"academic_year":"2026","semester":"1"}')
    ON CONFLICT (key)
    DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
    `,
  );

  await client.query("COMMIT");
  console.log("Neon setup completed successfully.");
}

run()
  .catch(async (err) => {
    await client.query("ROLLBACK");
    console.error("Neon setup failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end();
  });
