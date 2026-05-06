"use client";

import { FormEvent, useState } from "react";
import { GlassCard } from "@/components/ui";
import { apiFetch } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await apiFetch<{ message: string; resetLink?: string }>("forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage(res.resetLink ? `${res.message} | ${res.resetLink}` : res.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
      <GlassCard title="ลืมรหัสผ่าน" subtitle="ส่งลิงก์รีเซ็ตผ่าน /api/forgot-password" className="w-full max-w-md">
        <form className="grid gap-4" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            อีเมล
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 outline-none focus:border-cyan-300/60"
            />
          </label>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          {message ? <p className="text-xs text-lime-300 break-all">{message}</p> : null}
          <button className="rounded-full bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-lime-300">
            ส่งลิงก์รีเซ็ตรหัสผ่าน
          </button>
        </form>
      </GlassCard>
    </main>
  );
}
