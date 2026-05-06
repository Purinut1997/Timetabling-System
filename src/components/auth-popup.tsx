"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/api";

type AuthMode = "login" | "register";

type AuthPopupProps = {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
};

export function AuthPopup({ isOpen, initialMode = "login", onClose }: AuthPopupProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [schools, setSchools] = useState<{ id: number; name: string }[]>([]);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    schoolId: "",
  });

  const loadSchools = async () => {
    if (schools.length > 0) return;
    try {
      const res = await apiFetch<{ schools: { id: number; name: string }[] }>("schools");
      setSchools(res.schools || []);
    } catch {
      setError("ไม่สามารถโหลดรายชื่อโรงเรียนได้");
    }
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch<{
        token: string;
        user: { role: "teacher" | "school_admin" | "super_admin"; full_name: string; email: string };
      }>("login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      });
      localStorage.setItem("tt_token", res.token);
      localStorage.setItem("tt_role", res.user.role);
      localStorage.setItem("tt_user", JSON.stringify(res.user));
      onClose();
      if (res.user.role === "teacher") router.push("/teacher-dashboard");
      else if (res.user.role === "school_admin") router.push("/admin-dashboard");
      else router.push("/super-dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await apiFetch("register", {
        method: "POST",
        body: JSON.stringify(registerForm),
      });
      setMessage("ลงทะเบียนสำเร็จ! สามารถเข้าสู่ระบบได้ทันที");
      setMode("login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "สมัครสมาชิกไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/72 px-4 backdrop-blur-xl">
      <div className="w-full max-w-md rounded-[2rem] border border-white/15 bg-[#0b1730]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,.45)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 text-xs text-cyan-200">
              <Sparkles className="h-3 w-3" /> Secure Access
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิกครู"}</h2>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/10 p-2 hover:bg-white/20" aria-label="ปิด">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-full border border-white/10 bg-white/5 p-1 text-sm">
          <button
            onClick={() => setMode("login")}
            className={`rounded-full px-3 py-2 ${mode === "login" ? "bg-cyan-300 text-slate-950 font-semibold" : "text-slate-200"}`}
          >
            เข้าสู่ระบบ
          </button>
          <button
            onClick={async () => {
              setMode("register");
              await loadSchools();
            }}
            className={`rounded-full px-3 py-2 ${mode === "register" ? "bg-cyan-300 text-slate-950 font-semibold" : "text-slate-200"}`}
          >
            สมัครสมาชิก
          </button>
        </div>

        {mode === "login" ? (
          <form className="grid gap-3" onSubmit={handleLogin}>
            <input
              value={loginForm.email}
              onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
              className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 outline-none focus:border-cyan-300/60"
              placeholder="อีเมลหรือ admin"
            />
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
              className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 outline-none focus:border-cyan-300/60"
              placeholder="รหัสผ่าน"
            />
            <button
              disabled={loading}
              className="mt-1 rounded-full bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-lime-300 disabled:opacity-70"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
            <Link href="/forgot-password" className="text-center text-sm text-cyan-200 hover:text-lime-200">
              ลืมรหัสผ่าน?
            </Link>
          </form>
        ) : (
          <form className="grid gap-3" onSubmit={handleRegister}>
            <input
              value={registerForm.fullName}
              onChange={(e) => setRegisterForm((p) => ({ ...p, fullName: e.target.value }))}
              className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 outline-none focus:border-cyan-300/60"
              placeholder="ชื่อ-นามสกุล"
            />
            <input
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))}
              className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 outline-none focus:border-cyan-300/60"
              placeholder="อีเมล"
            />
            <input
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))}
              className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 outline-none focus:border-cyan-300/60"
              placeholder="รหัสผ่าน"
            />
            <input
              type="password"
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm((p) => ({ ...p, confirmPassword: e.target.value }))}
              className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 outline-none focus:border-cyan-300/60"
              placeholder="ยืนยันรหัสผ่าน"
            />
            <select
              value={registerForm.schoolId}
              onChange={(e) => setRegisterForm((p) => ({ ...p, schoolId: e.target.value }))}
              onFocus={loadSchools}
              className="rounded-2xl border border-white/12 bg-[#0b1730] px-4 py-3 outline-none focus:border-cyan-300/60"
            >
              <option value="">เลือกโรงเรียน</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
            <button
              disabled={loading}
              className="mt-1 rounded-full bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-lime-300 disabled:opacity-70"
            >
              {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
            </button>
          </form>
        )}

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
        {message ? <p className="mt-3 text-sm text-lime-300">{message}</p> : null}
      </div>
    </div>
  );
}
