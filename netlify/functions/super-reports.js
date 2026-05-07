const { query } = require("./_lib/db");
const { json } = require("./_lib/http");
const { verifyTokenFromEvent } = require("./_lib/auth");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return json(200, { ok: true });

  try {
    const payload = verifyTokenFromEvent(event);
    
    if (payload.role !== "super_admin") {
      return json(403, { error: "Super admin access required" });
    }

    if (event.httpMethod !== "GET") {
      return json(405, { error: "Method not allowed" });
    }

    const { type, period } = event.queryStringParameters || {};
    
    let reports = {};

    // Basic stats
    const schoolsCount = await query("SELECT COUNT(*) as count FROM schools");
    const usersCount = await query("SELECT COUNT(*) as count FROM users");
    const teachersCount = await query("SELECT COUNT(*) as count FROM users WHERE role = 'teacher'");
    const adminsCount = await query("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
    
    reports.overview = {
      schools: parseInt(schoolsCount.rows[0].count),
      users: parseInt(usersCount.rows[0].count),
      teachers: parseInt(teachersCount.rows[0].count),
      admins: parseInt(adminsCount.rows[0].count)
    };

    // User statistics
    const userStats = await query(`
      SELECT 
        role,
        status,
        COUNT(*) as count,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_this_month,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as new_this_week
      FROM users 
      GROUP BY role, status
      ORDER BY role, status
    `);
    
    reports.user_stats = userStats.rows;

    // School statistics
    const schoolStats = await query(`
      SELECT 
        s.id,
        s.name,
        COUNT(u.id) as user_count,
        COUNT(CASE WHEN u.role = 'teacher' THEN 1 END) as teacher_count,
        COUNT(CASE WHEN u.role = 'admin' THEN 1 END) as admin_count,
        COUNT(CASE WHEN u.status = 'active' THEN 1 END) as active_count
      FROM schools s
      LEFT JOIN users u ON s.id = u.school_id
      GROUP BY s.id, s.name
      ORDER BY s.name
    `);
    
    reports.school_stats = schoolStats.rows;

    // Substitute requests statistics
    const substituteStats = await query(`
      SELECT 
        COUNT(*) as total_requests,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as this_month,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as this_week
      FROM substitutes
    `);
    
    reports.substitute_stats = substituteStats.rows[0];

    // Monthly trends (last 6 months)
    const monthlyTrends = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as new_users,
        COUNT(CASE WHEN role = 'teacher' THEN 1 END) as new_teachers,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as new_admins
      FROM users 
      WHERE created_at > NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `);
    
    reports.monthly_trends = monthlyTrends.rows;

    // Daily activity (last 30 days)
    const dailyActivity = await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_users,
        COUNT(CASE WHEN role = 'teacher' THEN 1 END) as new_teachers
      FROM users 
      WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `);
    
    reports.daily_activity = dailyActivity.rows;

    // System health
    const systemHealth = {
      database_status: "healthy",
      last_backup: new Date().toISOString(), // This would come from actual backup system
      storage_usage: "45%", // This would come from actual storage monitoring
      active_sessions: 23 // This would come from session management
    };
    
    reports.system_health = systemHealth;

    return json(200, { reports });

  } catch (error) {
    return json(401, { error: "Unauthorized", detail: error.message });
  }
};
