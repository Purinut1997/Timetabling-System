import { GlassCard, InputField } from "@/components/ui";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
      <GlassCard title="ลืมรหัสผ่าน" subtitle="ส่งลิงก์รีเซ็ตผ่าน /api/forgot-password" className="w-full max-w-md">
        <form className="grid gap-4">
          <InputField label="อีเมล" type="email" placeholder="your@email.com" />
          <button className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            ส่งลิงก์รีเซ็ตรหัสผ่าน
          </button>
        </form>
      </GlassCard>
    </main>
  );
}
