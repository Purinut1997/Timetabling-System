import { GlassCard, InputField } from "@/components/ui";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
      <GlassCard title="ตั้งรหัสผ่านใหม่" subtitle="รับ token แล้วเรียก /api/reset-password" className="w-full max-w-md">
        <form className="grid gap-4">
          <InputField label="รหัสผ่านใหม่" type="password" placeholder="••••••••" />
          <InputField label="ยืนยันรหัสผ่านใหม่" type="password" placeholder="••••••••" />
          <button className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            บันทึกรหัสผ่านใหม่
          </button>
        </form>
      </GlassCard>
    </main>
  );
}
