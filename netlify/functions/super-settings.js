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
      // Get system settings
      const result = await query(
        "SELECT key, value FROM system_contents WHERE key = 'system_config'"
      );
      
      if (result.rows.length === 0) {
        // Return default settings
        const defaultSettings = {
          periods: 9,
          school_days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          academic_year: "2026",
          semester: "1",
          period_duration: 50,
          start_time: "08:00",
          end_time: "15:30",
          break_time: "12:00",
          break_duration: 60
        };
        return json(200, { settings: defaultSettings });
      }
      
      try {
        const settings = JSON.parse(result.rows[0].value);
        return json(200, { settings });
      } catch (error) {
        return json(500, { error: "Invalid system config format" });
      }
    }

    if (event.httpMethod === "PUT") {
      // Update system settings
      const { settings } = parseBody(event);
      
      if (!settings || typeof settings !== "object") {
        return json(400, { error: "Settings object is required" });
      }

      // Validate required fields
      const requiredFields = ['periods', 'school_days', 'academic_year', 'semester'];
      for (const field of requiredFields) {
        if (settings[field] === undefined) {
          return json(400, { error: `${field} is required` });
        }
      }

      // Validate data types and ranges
      if (typeof settings.periods !== "number" || settings.periods < 1 || settings.periods > 20) {
        return json(400, { error: "Periods must be a number between 1 and 20" });
      }

      if (!Array.isArray(settings.school_days) || settings.school_days.length === 0) {
        return json(400, { error: "School days must be a non-empty array" });
      }

      const validDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      for (const day of settings.school_days) {
        if (!validDays.includes(day)) {
          return json(400, { error: `Invalid school day: ${day}` });
        }
      }

      if (typeof settings.academic_year !== "string" || settings.academic_year.length !== 4) {
        return json(400, { error: "Academic year must be a 4-character string" });
      }

      if (!["1", "2"].includes(settings.semester)) {
        return json(400, { error: "Semester must be '1' or '2'" });
      }

      // Set defaults for optional fields
      const finalSettings = {
        periods: settings.periods,
        school_days: settings.school_days,
        academic_year: settings.academic_year,
        semester: settings.semester,
        period_duration: settings.period_duration || 50,
        start_time: settings.start_time || "08:00",
        end_time: settings.end_time || "15:30",
        break_time: settings.break_time || "12:00",
        break_duration: settings.break_duration || 60
      };

      const result = await query(
        "INSERT INTO system_contents (key, value) VALUES ('system_config', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW() RETURNING key, value, updated_at",
        [JSON.stringify(finalSettings)]
      );
      
      return json(200, { 
        settings: finalSettings, 
        message: "System settings updated successfully",
        updated_at: result.rows[0].updated_at
      });
    }

    return json(405, { error: "Method not allowed" });

  } catch (error) {
    return json(401, { error: "Unauthorized", detail: error.message });
  }
};
