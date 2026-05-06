"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { GlassCard, ButtonLink } from "@/components/ui";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiFetch<{
        token: string;
        user: { role: "teacher" | "school_admin" | "super_admin"; full_name: string; email: string };
      }>("login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("tt_token", response.token);
      localStorage.setItem("tt_role", response.user.role);
      localStorage.setItem("tt_user", JSON.stringify(response.user));

      if (response.user.role === "teacher") router.push("/teacher-dashboard");
      else if (response.user.role === "school_admin") router.push("/admin-dashboard");
      else router.push("/super-dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#06111f] p-4 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,.22),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(132,204,22,.14),transparent_28%),linear-gradient(135deg,#06111f_0%,#0b1730_48%,#101827_100%)]" />
      <GlassCard title="เข้าสู่ระบบ" subtitle="เชื่อมต่อกับ /api/login" className="w-full max-w-md">
        <form className="grid gap-4" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2 text-sm text-white/80">
            อีเมลหรือ Username
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.ac.th หรือ admin"
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-white/80">
            รหัสผ่าน
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 text-white outline-none transition focus:border-cyan-300/60"
            />
          </label>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <button
            disabled={loading}
            className="rounded-full bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,.35)] transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
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
