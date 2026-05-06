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
    const result = await query("SELECT id, name FROM schools ORDER BY name ASC");
    return json(200, { schools: result.rows });
  } catch (error) {
    return json(500, { error: "Failed to load schools", detail: error.message });
  }
};
