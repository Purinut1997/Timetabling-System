import bcrypt from "bcryptjs";
import pkg from "pg";

const { Client } = pkg;

// รับ DATABASE_URL จาก environment variable
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

// รับรหัสผ่านใหม่จาก command line argument หรือใช้ค่าเริ่มต้น
const newPassword = process.argv[2] || "admin";
const email = "admin@gmail.com";

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function resetPassword() {
  try {
    await client.connect();
    
    // hash รหัสผ่านใหม่
    const passwordHash = await bcrypt.hash(newPassword, 12);
    
    // อัพเดทรหัสผ่านใน database
    const result = await client.query(
      "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE email = $2 AND role = 'super_admin'",
      [passwordHash, email]
    );
    
    if (result.rowCount > 0) {
      console.log(`✅ อัพเดทรหัสผ่านสำหรับ ${email} เป็น "${newPassword}" สำเร็จแล้ว`);
    } else {
      console.log(`❌ ไม่พบผู้ใช้ ${email} ที่มี role = 'super_admin'`);
    }
    
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

resetPassword();
