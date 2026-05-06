import { DashboardLayout, GlassCard, InputField } from "@/components/ui";
import { teacherNav } from "@/lib/mock-data";

export default function TeacherDashboardPage() {
  return (
    <DashboardLayout title="Teacher Dashboard" role="Logged in as Teacher" nav={teacherNav}>
      <GlassCard title="ตารางสอนของฉัน" subtitle="Weekly grid + substitute overlay">
        <p className="text-sm text-white/75">แสดงตารางรายสัปดาห์ (วัน x คาบ) และการสอนแทนที่อนุมัติแล้ว</p>
      </GlassCard>

      <GlassCard title="การสอนแทน" subtitle="ทั้งที่ฉันต้องไปแทน และที่มีคนมาแทนฉัน">
        <p className="text-sm text-white/75">ข้อมูลจากตาราง substitutes แยกสองมุมมองในหน้าเดียว</p>
      </GlassCard>

      <GlassCard title="ขอสอนแทน" subtitle="เชื่อมต่อ /api/request-substitute">
        <form className="grid gap-3 md:grid-cols-2">
          <InputField label="วันที่" type="date" />
          <InputField label="คาบ" placeholder="เช่น คาบ 3" />
          <InputField label="วิชา" placeholder="Mathematics" />
          <InputField label="เหตุผล" placeholder="ติดภารกิจราชการ" />
          <button className="md:col-span-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950">
            ส่งคำขอ
          </button>
        </form>
      </GlassCard>
    </DashboardLayout>
  );
}
