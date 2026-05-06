import { DashboardLayout, GlassCard, InputField } from "@/components/ui";
import { adminNav } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  return (
    <DashboardLayout title="School Admin Dashboard" role="role: school_admin" nav={adminNav}>
      <GlassCard title="จัดการครู" subtitle="CRUD ครูในโรงเรียน">
        <p className="mb-3 text-sm text-white/75">เพิ่ม/แก้ไข/รีเซ็ตรหัสผ่าน/ปิดใช้งานครู ผ่าน /api/admin/teachers</p>
        <div className="grid gap-3 md:grid-cols-3">
          <InputField label="ชื่อครู" />
          <InputField label="อีเมล" type="email" />
          <InputField label="รหัสผ่านเริ่มต้น" type="password" />
        </div>
      </GlassCard>

      <GlassCard title="จัดการสอนแทน" subtitle="ค้นหาครูว่างผ่าน /api/admin/free-teachers">
        <p className="text-sm text-white/75">เลือกครูต้นทาง + วัน + คาบ แล้วระบบแนะนำครูที่ว่างก่อนบันทึกอนุมัติ</p>
      </GlassCard>

      <GlassCard title="ดูตารางสอนครูทั้งหมด" subtitle="เชื่อม /api/admin/schedules">
        <p className="text-sm text-white/75">เลือกครูจาก dropdown และแก้ไขตารางประจำได้ทันที</p>
      </GlassCard>
    </DashboardLayout>
  );
}
