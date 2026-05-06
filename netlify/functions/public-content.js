const { query } = require("./_lib/db");
const { json } = require("./_lib/http");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const result = await query(
      "SELECT key, value FROM system_contents WHERE key = ANY($1::text[])",
      [["home_announcement", "contact_info", "privacy_policy", "about"]],
    );

    const payload = result.rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    return json(200, payload);
  } catch (error) {
    return json(500, { error: "Failed to load public content", detail: error.message });
  }
};
