const { getPool } = require("./_lib/db");
const { json, parseBody } = require("./_lib/http");
const { verifyTokenFromEvent } = require("./_lib/auth");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const payload = verifyTokenFromEvent(event);
    if (payload.role !== "teacher") return json(403, { error: "Only teachers can request substitute" });

    const { date, period, subject, reason } = parseBody(event);
    if (!date || !period || !subject || !reason) {
      return json(400, { error: "Missing required fields" });
    }

    const pool = getPool();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const teacherRes = await client.query("SELECT id, school_id FROM teachers WHERE user_id = $1 LIMIT 1", [payload.sub]);
      if (teacherRes.rows.length === 0) {
        await client.query("ROLLBACK");
        return json(404, { error: "Teacher profile not found" });
      }
      const teacher = teacherRes.rows[0];
      const insert = await client.query(
        `INSERT INTO substitutes
         (school_id, original_teacher_id, date_for_substitute, period, subject_name, reason, status, requested_by_user_id)
         VALUES ($1,$2,$3,$4,$5,$6,'pending',$7)
         RETURNING id, date_for_substitute, period, subject_name, reason, status`,
        [teacher.school_id, teacher.id, date, Number(period), subject, reason, payload.sub],
      );
      await client.query("COMMIT");
      return json(201, { message: "Request submitted", request: insert.rows[0] });
    } catch (error) {
      await client.query("ROLLBACK");
      return json(500, { error: "Failed to request substitute", detail: error.message });
    } finally {
      client.release();
    }
  } catch (error) {
    return json(401, { error: "Unauthorized", detail: error.message });
  }
};
