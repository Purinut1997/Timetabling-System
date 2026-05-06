import { DashboardLayout, GlassCard, InputField } from "@/components/ui";
import { superNav } from "@/lib/mock-data";

export default function SuperDashboardPage() {
  return (
    <DashboardLayout title="Super Admin Dashboard" role="role: super_admin" nav={superNav}>
      <GlassCard title="จัดการโรงเรียน" subtitle="ฐานข้อมูล schools">
        <div className="grid gap-3 md:grid-cols-2">
          <InputField label="ชื่อโรงเรียน" />
          <InputField label="อีเมลติดต่อ" type="email" />
        </div>
      </GlassCard>

      <GlassCard title="จัดการผู้ใช้ทั้งหมด" subtitle="users + roles + status">
        <p className="text-sm text-white/75">กรองตามโรงเรียน/บทบาท พร้อมรีเซ็ตรหัสผ่านหรือปรับสิทธิ์ผู้ใช้</p>
      </GlassCard>

      <GlassCard title="จัดการเนื้อหาหน้าแรก" subtitle="system_contents">
        <p className="text-sm text-white/75">แก้ไขประกาศ, contact, privacy policy, about แล้วบันทึกด้วย /api/super/system-content</p>
      </GlassCard>

      <GlassCard title="ตั้งค่าระบบ" subtitle="system_config">
        <p className="text-sm text-white/75">กำหนดจำนวนคาบเรียน, เวลาแต่ละคาบ, วันเรียน และภาคเรียนปัจจุบัน</p>
      </GlassCard>
    </DashboardLayout>
  );
}
