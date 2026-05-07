import bcrypt from "bcryptjs";
import pkg from "pg";

const { Client } = pkg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.log("❌ กรุณาตั้งค่า DATABASE_URL ก่อน");
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function checkAdminPassword() {
  try {
    await client.connect();
    
    const result = await client.query(
      "SELECT email, password_hash, role FROM users WHERE role = 'super_admin' LIMIT 1"
    );
    
    if (result.rows.length === 0) {
      console.log("❌ ไม่พบ super admin ในระบบ");
      return;
    }
    
    const admin = result.rows[0];
    console.log("✅ พบ Super Admin:");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password Hash: ${admin.password_hash.substring(0, 20)}...`);
    
    // ทดสอบรหัสผ่านที่ใช้บ่อย
    const commonPasswords = ["admin", "password", "123456", "thenik06"];
    
    for (const pwd of commonPasswords) {
      const isMatch = await bcrypt.compare(pwd, admin.password_hash);
      if (isMatch) {
        console.log(`   🔓 รหัสผ่านปัจจุบันคือ: "${pwd}"`);
        return;
      }
    }
    
    console.log("   ❌ ไม่สามารถตรวจสอบรหัสผ่านได้ (อาจเป็นรหัสผ่านที่ไม่ใช่ที่ทดสอบ)");
    
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาด:", error.message);
  } finally {
    await client.end();
  }
}

checkAdminPassword();
