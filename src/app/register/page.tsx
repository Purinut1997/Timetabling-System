"use client";

import { FormEvent, useEffect, useState } from "react";
import { GlassCard } from "@/components/ui";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const [schools, setSchools] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    schoolId: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch<{ schools: { id: number; name: string }[] }>("schools")
      .then((data) => setSchools(data.schools || []))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load schools"));
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await apiFetch("register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setMessage("ลงทะเบียนสำเร็จ สามารถไปหน้า Login ได้ทันที");
      setForm({ fullName: "", email: "", password: "", confirmPassword: "", schoolId: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#06111f] p-4 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,.22),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(132,204,22,.14),transparent_28%),linear-gradient(135deg,#06111f_0%,#0b1730_48%,#101827_100%)]" />
      <GlassCard title="สมัครสมาชิกครู" subtitle="เชื่อมต่อ /api/register + /api/schools" className="w-full max-w-xl">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2 text-sm text-white/80">
            ชื่อ - นามสกุล
            <input
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Teacher Name"
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-white/80">
            อีเมล
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="teacher@school.ac.th"
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-white/80">
            รหัสผ่าน
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="••••••••"
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-white/80">
            ยืนยันรหัสผ่าน
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="••••••••"
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
            />
          </label>
          <label className="md:col-span-2 flex flex-col gap-2 text-sm text-white/80">
            โรงเรียน
            <select
              value={form.schoolId}
              onChange={(e) => setForm((prev) => ({ ...prev, schoolId: e.target.value }))}
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3"
            >
              <option value="">เลือกโรงเรียน</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </label>
          {error ? <p className="md:col-span-2 text-sm text-rose-300">{error}</p> : null}
          {message ? <p className="md:col-span-2 text-sm text-emerald-300">{message}</p> : null}
          <button
            disabled={loading}
            className="md:col-span-2 rounded-full bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,.35)] transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
          </button>
        </form>
      </GlassCard>
    </main>
  );
}
