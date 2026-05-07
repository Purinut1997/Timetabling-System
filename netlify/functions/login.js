const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("./_lib/db");
const { json, parseBody } = require("./_lib/http");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  if (!process.env.JWT_SECRET) {
    return json(500, { error: "JWT_SECRET is not configured" });
  }

  const { email, password } = parseBody(event);
  if (!email || !password) {
    return json(400, { error: "Email/username and password are required" });
  }

  const identity = String(email).trim().toLowerCase();
  const lookupEmail = identity;

  try {
    const result = await query(
      "SELECT id, full_name, email, role, status, school_id, password_hash FROM users WHERE email = $1 LIMIT 1",
      [lookupEmail],
    );

    if (result.rows.length === 0) {
      return json(401, { error: "Invalid credentials" });
    }

    const user = result.rows[0];
    if (user.status !== "active") {
      return json(403, { error: "Account is disabled" });
    }

    const passOk = await bcrypt.compare(password, user.password_hash);
    if (!passOk) {
      return json(401, { error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role, school_id: user.school_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return json(200, {
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        school_id: user.school_id,
      },
    });
  } catch (error) {
    return json(500, { error: "Login failed", detail: error.message });
  }
};
