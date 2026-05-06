import Link from "next/link";
import { GlassCard, InputField, ButtonLink } from "@/components/ui";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_10%_10%,#1d4ed8_0%,#020617_45%)] p-4 text-white">
      <GlassCard title="เข้าสู่ระบบ" subtitle="เชื่อมต่อกับ /api/login" className="w-full max-w-md">
        <form className="grid gap-4">
          <InputField label="อีเมล" type="email" placeholder="you@school.ac.th" />
          <InputField label="รหัสผ่าน" type="password" placeholder="••••••••" />
          <button className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            เข้าสู่ระบบ
          </button>
        </form>
        <div className="mt-4 flex items-center justify-between text-sm text-white/80">
          <Link href="/forgot-password">ลืมรหัสผ่าน</Link>
          <Link href="/register">สมัครสมาชิก</Link>
        </div>
        <p className="mt-5 text-xs text-white/60">
          Super Admin Demo: <span className="font-semibold">admin / admin</span>
        </p>
        <div className="mt-4">
          <ButtonLink href="/" label="กลับหน้าแรก" variant="ghost" />
        </div>
      </GlassCard>
    </main>
  );
}
