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
      // Get all system content
      const result = await query(
        "SELECT key, value, updated_at FROM system_contents ORDER BY key ASC"
      );
      
      const content = {};
      result.rows.forEach(row => {
        content[row.key] = row.value;
      });
      
      return json(200, { content });
    }

    if (event.httpMethod === "PUT") {
      // Update system content
      const { key, value } = parseBody(event);
      
      if (!key || value === undefined) {
        return json(400, { error: "Key and value are required" });
      }

      const validKeys = ['home_announcement', 'contact_info', 'privacy_policy', 'about', 'system_config'];
      if (!validKeys.includes(key)) {
        return json(400, { error: "Invalid content key" });
      }

      const result = await query(
        "INSERT INTO system_contents (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW() RETURNING key, value, updated_at",
        [key, value]
      );
      
      return json(200, { content: result.rows[0] });
    }

    if (event.httpMethod === "POST") {
      // Bulk update multiple content items
      const { content } = parseBody(event);
      
      if (!content || typeof content !== "object") {
        return json(400, { error: "Content object is required" });
      }

      const validKeys = ['home_announcement', 'contact_info', 'privacy_policy', 'about', 'system_config'];
      const updates = [];
      const params = [];

      Object.entries(content).forEach(([key, value], index) => {
        if (validKeys.includes(key)) {
          updates.push(`($${index * 2 + 1}, $${index * 2 + 2})`);
          params.push(key, value);
        }
      });

      if (updates.length === 0) {
        return json(400, { error: "No valid content keys provided" });
      }

      await query("BEGIN");
      
      try {
        for (const [key, value] of Object.entries(content)) {
          if (validKeys.includes(key)) {
            await query(
              "INSERT INTO system_contents (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()",
              [key, value]
            );
          }
        }
        
        await query("COMMIT");
        
        // Return updated content
        const result = await query(
          "SELECT key, value, updated_at FROM system_contents ORDER BY key ASC"
        );
        
        const updatedContent = {};
        result.rows.forEach(row => {
          updatedContent[row.key] = row.value;
        });
        
        return json(200, { content: updatedContent, message: "Content updated successfully" });
        
      } catch (error) {
        await query("ROLLBACK");
        throw error;
      }
    }

    return json(405, { error: "Method not allowed" });

  } catch (error) {
    return json(401, { error: "Unauthorized", detail: error.message });
  }
};
