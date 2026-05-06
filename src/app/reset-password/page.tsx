"use client";

import { FormEvent, useState } from "react";
import { GlassCard } from "@/components/ui";
import { apiFetch } from "@/lib/api";

export default function ResetPasswordPage() {
  const [token, setToken] = useState(
    typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("token") || "",
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await apiFetch<{ message: string }>("reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });
      setMessage(res.message);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
      <GlassCard title="ตั้งรหัสผ่านใหม่" subtitle="รับ token แล้วเรียก /api/reset-password" className="w-full max-w-md">
        <form className="grid gap-4" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Token
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 outline-none focus:border-cyan-300/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            รหัสผ่านใหม่
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 outline-none focus:border-cyan-300/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            ยืนยันรหัสผ่านใหม่
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 outline-none focus:border-cyan-300/60"
            />
          </label>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          {message ? <p className="text-sm text-lime-300">{message}</p> : null}
          <button className="rounded-full bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-lime-300">
            บันทึกรหัสผ่านใหม่
          </button>
        </form>
      </GlassCard>
    </main>
  );
}
