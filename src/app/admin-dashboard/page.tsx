"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout, GlassCard, InputField } from "@/components/ui";
import { logout, useRequireRole } from "@/lib/auth-client";
import { adminNav } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading } = useRequireRole(["school_admin"]);

  if (loading) {
    return <main className="grid min-h-screen place-items-center text-white">กำลังตรวจสอบสิทธิ์...</main>;
  }

  return (
    <DashboardLayout
      title="School Admin Dashboard"
      role="role: school_admin"
      nav={adminNav}
      userName={user?.full_name}
      onLogout={() => {
        logout();
        router.push("/login");
      }}
    >
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "ครูทั้งหมด", value: "64" },
          { label: "คาบสอนสัปดาห์นี้", value: "420" },
          { label: "คำขอสอนแทน", value: "7" },
          { label: "ครูว่างตอนนี้", value: "12" },
        ].map((item) => (
          <GlassCard key={item.label} title={item.label}>
            <p className="text-3xl font-semibold text-cyan-100">{item.value}</p>
          </GlassCard>
        ))}
      </section>

      <GlassCard title="จัดการครู" subtitle="CRUD ครูในโรงเรียน">
        <p className="mb-3 text-sm text-slate-300">เพิ่ม/แก้ไข/รีเซ็ตรหัสผ่าน/ปิดใช้งานครู ผ่าน /api/admin/teachers</p>
        <div className="grid gap-3 md:grid-cols-3">
          <InputField label="ชื่อครู" />
          <InputField label="อีเมล" type="email" />
          <InputField label="รหัสผ่านเริ่มต้น" type="password" />
        </div>
      </GlassCard>

      <GlassCard title="จัดการสอนแทน" subtitle="ค้นหาครูว่างผ่าน /api/admin/free-teachers">
        <p className="text-sm text-slate-300">เลือกครูต้นทาง + วัน + คาบ แล้วระบบแนะนำครูที่ว่างก่อนบันทึกอนุมัติ</p>
      </GlassCard>

      <GlassCard title="ดูตารางสอนครูทั้งหมด" subtitle="เชื่อม /api/admin/schedules">
        <p className="text-sm text-slate-300">เลือกครูจาก dropdown และแก้ไขตารางประจำได้ทันที</p>
      </GlassCard>
    </DashboardLayout>
  );
}
