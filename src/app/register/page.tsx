import { GlassCard, InputField } from "@/components/ui";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_90%_10%,#0f766e_0%,#020617_50%)] p-4 text-white">
      <GlassCard title="สมัครสมาชิกครู" subtitle="เชื่อมต่อ /api/register + /api/schools" className="w-full max-w-xl">
        <form className="grid gap-4 md:grid-cols-2">
          <InputField label="ชื่อ - นามสกุล" placeholder="Teacher Name" />
          <InputField label="อีเมล" type="email" placeholder="teacher@school.ac.th" />
          <InputField label="รหัสผ่าน" type="password" placeholder="••••••••" />
          <InputField label="ยืนยันรหัสผ่าน" type="password" placeholder="••••••••" />
          <label className="md:col-span-2 flex flex-col gap-2 text-sm text-white/80">
            โรงเรียน
            <select className="rounded-xl border border-white/20 bg-slate-900/70 px-4 py-3">
              <option>เลือกโรงเรียน</option>
              <option>Demo School A</option>
              <option>Demo School B</option>
            </select>
          </label>
          <button className="md:col-span-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            ลงทะเบียน
          </button>
        </form>
      </GlassCard>
    </main>
  );
}
