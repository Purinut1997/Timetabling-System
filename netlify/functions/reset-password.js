const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { getPool } = require("./_lib/db");
const { json, parseBody } = require("./_lib/http");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  const { token, newPassword, confirmPassword } = parseBody(event);
  if (!token || !newPassword || !confirmPassword) return json(400, { error: "Missing required fields" });
  if (newPassword !== confirmPassword) return json(400, { error: "Password confirmation does not match" });
  if (newPassword.length < 8) return json(400, { error: "Password must be at least 8 characters" });

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const resetRes = await client.query(
      `SELECT id, user_id FROM password_resets
       WHERE reset_token_hash = $1
         AND used_at IS NULL
         AND expires_at > NOW()
       ORDER BY id DESC
       LIMIT 1`,
      [tokenHash],
    );
    if (resetRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return json(400, { error: "Invalid or expired token" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await client.query("UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2", [
      passwordHash,
      resetRes.rows[0].user_id,
    ]);
    await client.query("UPDATE password_resets SET used_at = NOW() WHERE id = $1", [resetRes.rows[0].id]);
    await client.query("COMMIT");
    return json(200, { message: "Password reset successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    return json(500, { error: "Failed to reset password", detail: error.message });
  } finally {
    client.release();
  }
};
