const { query } = require("./_lib/db");
const { json, parseBody } = require("./_lib/http");
const { verifyTokenFromEvent } = require("./_lib/auth");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });

  try {
    const payload = verifyTokenFromEvent(event);
    
    if (payload.role !== "super_admin") {
      return json(403, { error: "Super admin access required" });
    }

    if (event.httpMethod === "GET") {
      // Get all schools
      const result = await query(
        "SELECT id, name, address, contact_email, created_at, updated_at FROM schools ORDER BY name ASC"
      );
      return json(200, { schools: result.rows });
    }

    if (event.httpMethod === "POST") {
      // Create new school
      const { name, address, contact_email } = parseBody(event);
      
      if (!name || !address || !contact_email) {
        return json(400, { error: "Name, address, and contact email are required" });
      }

      const result = await query(
        "INSERT INTO schools (name, address, contact_email) VALUES ($1, $2, $3) RETURNING id, name, address, contact_email, created_at, updated_at",
        [name, address, contact_email]
      );
      
      return json(201, { school: result.rows[0] });
    }

    if (event.httpMethod === "PUT") {
      // Update school
      const { id, name, address, contact_email } = parseBody(event);
      
      if (!id || !name || !address || !contact_email) {
        return json(400, { error: "ID, name, address, and contact email are required" });
      }

      const result = await query(
        "UPDATE schools SET name = $1, address = $2, contact_email = $3, updated_at = NOW() WHERE id = $4 RETURNING id, name, address, contact_email, updated_at",
        [name, address, contact_email, id]
      );
      
      if (result.rows.length === 0) {
        return json(404, { error: "School not found" });
      }
      
      return json(200, { school: result.rows[0] });
    }

    if (event.httpMethod === "DELETE") {
      // Delete school
      const schoolId = event.pathParameters?.schoolId;
      
      if (!schoolId) {
        return json(400, { error: "School ID is required" });
      }

      // Check if school has users
      const usersCount = await query(
        "SELECT COUNT(*) as count FROM users WHERE school_id = $1",
        [schoolId]
      );
      
      if (parseInt(usersCount.rows[0].count) > 0) {
        return json(400, { error: "Cannot delete school with existing users" });
      }

      const result = await query(
        "DELETE FROM schools WHERE id = $1 RETURNING id, name",
        [schoolId]
      );
      
      if (result.rows.length === 0) {
        return json(404, { error: "School not found" });
      }
      
      return json(200, { message: "School deleted successfully", school: result.rows[0] });
    }

    return json(405, { error: "Method not allowed" });

  } catch (error) {
    return json(401, { error: "Unauthorized", detail: error.message });
  }
};
