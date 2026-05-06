const crypto = require("crypto");
const { query } = require("./_lib/db");
const { json, parseBody } = require("./_lib/http");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const { email } = parseBody(event);
    if (!email) return json(400, { error: "Email is required" });

    const normalizedEmail = String(email).trim().toLowerCase();
    const userRes = await query("SELECT id FROM users WHERE email = $1 LIMIT 1", [normalizedEmail]);
    if (userRes.rows.length === 0) {
      return json(200, { message: "If this email exists, reset link has been issued" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await query(
      "INSERT INTO password_resets (user_id, reset_token_hash, expires_at) VALUES ($1, $2, $3)",
      [userRes.rows[0].id, tokenHash, expiresAt.toISOString()],
    );

    const resetUrlBase = process.env.PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${resetUrlBase}/reset-password?token=${token}`;
    return json(200, {
      message: "Reset token generated (email integration pending)",
      resetLink,
    });
  } catch (error) {
    return json(500, { error: "Failed to process forgot password", detail: error.message });
  }
};
