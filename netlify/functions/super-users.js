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
      // Get all users with optional filters
      const { school_id, role, status, search } = event.queryStringParameters || {};
      
      let whereClause = "WHERE 1=1";
      let params = [];
      let paramIndex = 1;

      if (school_id) {
        whereClause += ` AND u.school_id = $${paramIndex++}`;
        params.push(school_id);
      }
      
      if (role) {
        whereClause += ` AND u.role = $${paramIndex++}`;
        params.push(role);
      }
      
      if (status) {
        whereClause += ` AND u.status = $${paramIndex++}`;
        params.push(status);
      }
      
      if (search) {
        whereClause += ` AND (u.full_name ILIKE $${paramIndex++} OR u.email ILIKE $${paramIndex++})`;
        params.push(`%${search}%`, `%${search}%`);
      }

      const result = await query(`
        SELECT u.id, u.full_name, u.email, u.role, u.status, u.school_id, u.created_at, u.updated_at,
               s.name as school_name
        FROM users u
        LEFT JOIN schools s ON u.school_id = s.id
        ${whereClause}
        ORDER BY u.created_at DESC
      `, params);

      return json(200, { users: result.rows });
    }

    if (event.httpMethod === "POST") {
      // Create new user
      const { full_name, email, password, role, school_id } = parseBody(event);
      
      if (!full_name || !email || !password || !role || !school_id) {
        return json(400, { error: "All fields are required" });
      }

      // Check if email already exists
      const existingUser = await query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );
      
      if (existingUser.rows.length > 0) {
        return json(400, { error: "Email already exists" });
      }

      // Hash password
      const bcrypt = require("bcryptjs");
      const passwordHash = await bcrypt.hash(password, 12);

      const result = await query(
        `INSERT INTO users (full_name, email, password_hash, role, status, school_id) 
         VALUES ($1, $2, $3, $4, 'active', $5) 
         RETURNING id, full_name, email, role, status, school_id, created_at`,
        [full_name, email, passwordHash, role, school_id]
      );
      
      return json(201, { user: result.rows[0] });
    }

    if (event.httpMethod === "PUT") {
      // Update user
      const { id, full_name, email, role, status, school_id } = parseBody(event);
      
      if (!id) {
        return json(400, { error: "User ID is required" });
      }

      let updateFields = [];
      let params = [];
      let paramIndex = 1;

      if (full_name !== undefined) {
        updateFields.push(`full_name = $${paramIndex++}`);
        params.push(full_name);
      }
      
      if (email !== undefined) {
        updateFields.push(`email = $${paramIndex++}`);
        params.push(email);
      }
      
      if (role !== undefined) {
        updateFields.push(`role = $${paramIndex++}`);
        params.push(role);
      }
      
      if (status !== undefined) {
        updateFields.push(`status = $${paramIndex++}`);
        params.push(status);
      }
      
      if (school_id !== undefined) {
        updateFields.push(`school_id = $${paramIndex++}`);
        params.push(school_id);
      }

      if (updateFields.length === 0) {
        return json(400, { error: "No fields to update" });
      }

      updateFields.push(`updated_at = NOW()`);
      params.push(id);

      const result = await query(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramIndex} 
         RETURNING id, full_name, email, role, status, school_id, updated_at`,
        params
      );
      
      if (result.rows.length === 0) {
        return json(404, { error: "User not found" });
      }
      
      return json(200, { user: result.rows[0] });
    }

    if (event.httpMethod === "DELETE") {
      // Delete user
      const userId = event.pathParameters?.userId;
      
      if (!userId) {
        return json(400, { error: "User ID is required" });
      }

      // Prevent deleting super admin
      const userCheck = await query(
        "SELECT role FROM users WHERE id = $1",
        [userId]
      );
      
      if (userCheck.rows.length === 0) {
        return json(404, { error: "User not found" });
      }
      
      if (userCheck.rows[0].role === "super_admin") {
        return json(400, { error: "Cannot delete super admin user" });
      }

      const result = await query(
        "DELETE FROM users WHERE id = $1 RETURNING id, full_name, email",
        [userId]
      );
      
      return json(200, { message: "User deleted successfully", user: result.rows[0] });
    }

    return json(405, { error: "Method not allowed" });

  } catch (error) {
    return json(401, { error: "Unauthorized", detail: error.message });
  }
};
