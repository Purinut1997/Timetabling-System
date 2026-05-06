const bcrypt = require("bcryptjs");
const { query } = require("./_lib/db");
const { json, parseBody } = require("./_lib/http");
const { verifyTokenFromEvent } = require("./_lib/auth");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const payload = verifyTokenFromEvent(event);
    const { currentPassword, newPassword, confirmPassword } = parseBody(event);
    if (!currentPassword || !newPassword || !confirmPassword) return json(400, { error: "Missing required fields" });
    if (newPassword !== confirmPassword) return json(400, { error: "Password confirmation does not match" });
    if (newPassword.length < 8) return json(400, { error: "New password must be at least 8 characters" });

    const userResult = await query("SELECT id, password_hash FROM users WHERE id = $1 LIMIT 1", [payload.sub]);
    if (userResult.rows.length === 0) return json(404, { error: "User not found" });

    const ok = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
    if (!ok) return json(401, { error: "Current password is incorrect" });

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await query("UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2", [passwordHash, payload.sub]);
    return json(200, { message: "Password updated successfully" });
  } catch (error) {
    return json(401, { error: "Unauthorized", detail: error.message });
  }
};
