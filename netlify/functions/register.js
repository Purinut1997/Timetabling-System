const bcrypt = require("bcryptjs");
const { getPool } = require("./_lib/db");
const { json, parseBody } = require("./_lib/http");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const { fullName, email, password, confirmPassword, schoolId } = parseBody(event);
  if (!fullName || !email || !password || !confirmPassword || !schoolId) {
    return json(400, { error: "Missing required fields" });
  }

  if (password !== confirmPassword) {
    return json(400, { error: "Password confirmation does not match" });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existing = await client.query("SELECT id FROM users WHERE email = $1 LIMIT 1", [normalizedEmail]);
    if (existing.rows.length > 0) {
      await client.query("ROLLBACK");
      return json(409, { error: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 12);
    const userInsert = await client.query(
      `
      INSERT INTO users (full_name, email, password_hash, role, status, school_id)
      VALUES ($1, $2, $3, 'teacher', 'active', $4)
      RETURNING id, full_name, email, role, school_id
      `,
      [fullName, normalizedEmail, hash, Number(schoolId)],
    );

    const user = userInsert.rows[0];
    await client.query(
      "INSERT INTO teachers (user_id, school_id, subject_group) VALUES ($1, $2, $3)",
      [user.id, user.school_id, "General"],
    );

    await client.query("COMMIT");
    return json(201, { message: "Register success", user });
  } catch (error) {
    await client.query("ROLLBACK");
    return json(500, { error: "Register failed", detail: error.message });
  } finally {
    client.release();
  }
};
