"use client";

import { useRouter } from "next/navigation";
import { DashboardLayout, GlassCard, InputField } from "@/components/ui";
import { logout, useRequireRole } from "@/lib/auth-client";
import { superNav } from "@/lib/mock-data";

export default function SuperDashboardPage() {
  const router = useRouter();
  const { user, loading } = useRequireRole(["super_admin"]);

  if (loading) {
    return <main className="grid min-h-screen place-items-center text-white">กำลังตรวจสอบสิทธิ์...</main>;
  }

  return (
    <DashboardLayout
      title="Super Admin Dashboard"
      role="role: super_admin"
      nav={superNav}
      userName={user?.full_name}
      onLogout={() => {
        logout();
        router.push("/login");
      }}
    >
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "โรงเรียนทั้งหมด", value: "3" },
          { label: "ผู้ใช้ทั้งหมด", value: "154" },
          { label: "สอนแทนเดือนนี้", value: "41" },
          { label: "บัญชีรอจัดการ", value: "9" },
        ].map((item) => (
          <GlassCard key={item.label} title={item.label}>
            <p className="text-3xl font-semibold text-cyan-100">{item.value}</p>
          </GlassCard>
        ))}
      </section>

      <GlassCard title="จัดการโรงเรียน" subtitle="ฐานข้อมูล schools">
        <div className="grid gap-3 md:grid-cols-2">
          <InputField label="ชื่อโรงเรียน" />
          <InputField label="อีเมลติดต่อ" type="email" />
        </div>
      </GlassCard>

      <GlassCard title="จัดการผู้ใช้ทั้งหมด" subtitle="users + roles + status">
        <p className="text-sm text-slate-300">กรองตามโรงเรียน/บทบาท พร้อมรีเซ็ตรหัสผ่านหรือปรับสิทธิ์ผู้ใช้</p>
      </GlassCard>

      <GlassCard title="จัดการเนื้อหาหน้าแรก" subtitle="system_contents">
        <p className="text-sm text-slate-300">แก้ไขประกาศ, contact, privacy policy, about แล้วบันทึกด้วย /api/super/system-content</p>
      </GlassCard>

      <GlassCard title="ตั้งค่าระบบ" subtitle="system_config">
        <p className="text-sm text-slate-300">กำหนดจำนวนคาบเรียน, เวลาแต่ละคาบ, วันเรียน และภาคเรียนปัจจุบัน</p>
      </GlassCard>
    </DashboardLayout>
  );
}
