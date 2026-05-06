const { query } = require("./_lib/db");
const { json } = require("./_lib/http");
const { verifyTokenFromEvent } = require("./_lib/auth");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });

  try {
    const payload = verifyTokenFromEvent(event);
    const result = await query(
      "SELECT id, full_name, email, role, status, school_id FROM users WHERE id = $1 LIMIT 1",
      [payload.sub],
    );
    if (result.rows.length === 0) return json(401, { error: "User not found" });
    const user = result.rows[0];
    if (user.status !== "active") return json(403, { error: "Account is disabled" });
    return json(200, { user });
  } catch (error) {
    return json(401, { error: "Unauthorized", detail: error.message });
  }
};
