"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout, GlassCard } from "@/components/ui";
import { apiFetch } from "@/lib/api";
import { getAuthToken, logout, useRequireRole } from "@/lib/auth-client";
import { teacherNav } from "@/lib/mock-data";

const days = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์"];
const periods = [
  { no: 1, time: "08:30-09:20" },
  { no: 2, time: "09:20-10:10" },
  { no: 3, time: "10:20-11:10" },
  { no: 4, time: "11:10-12:00" },
  { no: 5, time: "13:00-13:50" },
  { no: 6, time: "13:50-14:40" },
];

const lessons = [
  { day: "จันทร์", period: 1, subject: "คณิตศาสตร์ ม.2/1", room: "221", type: "normal" },
  { day: "จันทร์", period: 5, subject: "สอนแทน ภาษาไทย ม.3/1", room: "314", type: "substitute" },
  { day: "อังคาร", period: 3, subject: "คณิตศาสตร์ ม.2/2", room: "222", type: "normal" },
  { day: "พุธ", period: 4, subject: "ประชุม PLC", room: "วิชาการ", type: "normal" },
  { day: "พฤหัสบดี", period: 3, subject: "สอนแทน คณิตศาสตร์ ม.1/3", room: "113", type: "substitute" },
  { day: "ศุกร์", period: 4, subject: "กิจกรรมชุมนุม", room: "อเนกประสงค์", type: "normal" },
];

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { user, loading } = useRequireRole(["teacher"]);
  const [selectedDay, setSelectedDay] = useState("ทั้งหมด");
  const [requestForm, setRequestForm] = useState({ date: "", period: "", subject: "", reason: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [requestMessage, setRequestMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const mobileLessons = useMemo(() => {
    if (selectedDay === "ทั้งหมด") return lessons;
    return lessons.filter((lesson) => lesson.day === selectedDay);
  }, [selectedDay]);

  const lessonFor = (day: string, period: number) =>
    lessons.find((lesson) => lesson.day === day && lesson.period === period);

  const onRequestSubstitute = async (event: FormEvent) => {
    event.preventDefault();
    setRequestError("");
    setRequestMessage("");
    try {
      await apiFetch("request-substitute", {
        method: "POST",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: JSON.stringify(requestForm),
      });
      setRequestMessage("ส่งคำขอสอนแทนสำเร็จ");
      setRequestForm({ date: "", period: "", subject: "", reason: "" });
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "ไม่สามารถส่งคำขอได้");
    }
  };

  const onChangePassword = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");
    try {
      await apiFetch("change-password", {
        method: "POST",
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        body: JSON.stringify(passwordForm),
      });
      setPasswordMessage("เปลี่ยนรหัสผ่านสำเร็จ");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "ไม่สามารถเปลี่ยนรหัสผ่านได้");
    }
  };

  const onLogout = () => {
    logout();
    router.replace("/");
  };

  if (loading) {
    return <main className="grid min-h-screen place-items-center text-white">กำลังตรวจสอบสิทธิ์...</main>;
  }

  return (
    <DashboardLayout
      title="Teacher Dashboard"
      role="Logged in as Teacher"
      nav={teacherNav}
      userName={user?.full_name}
      onLogout={onLogout}
    >
      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "คาบสอนสัปดาห์นี้", value: "11" },
          { label: "งานสอนแทน", value: "2" },
          { label: "ช่วงเวลาว่าง", value: "7" },
        ].map((item) => (
          <GlassCard key={item.label} title={item.label}>
            <p className="text-3xl font-semibold text-cyan-100">{item.value}</p>
          </GlassCard>
        ))}
      </section>

      <GlassCard title="ตารางสอนของฉัน" subtitle="Desktop grid + Mobile cards">
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[900px] border-separate border-spacing-2 text-left">
            <thead>
              <tr>
                <th className="rounded-2xl bg-slate-950/40 px-4 py-3 text-sm text-cyan-100">วัน / คาบ</th>
                {periods.map((period) => (
                  <th key={period.no} className="rounded-2xl bg-slate-950/40 px-4 py-3 text-sm text-slate-100">
                    คาบ {period.no}
                    <span className="mt-1 block text-xs text-slate-400">{period.time}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day}>
                  <th className="rounded-2xl bg-cyan-300/12 px-4 py-4 text-base font-semibold text-cyan-100">{day}</th>
                  {periods.map((period) => {
                    const lesson = lessonFor(day, period.no);
                    return (
                      <td key={`${day}-${period.no}`} className="align-top">
                        {lesson ? (
                          <div
                            className={`min-h-[92px] rounded-2xl border p-3 ${
                              lesson.type === "substitute"
                                ? "border-amber-300/40 bg-amber-300/14"
                                : "border-cyan-300/24 bg-cyan-300/10"
                            }`}
                          >
                            <p className="text-sm font-semibold">{lesson.subject}</p>
                            <p className="mt-1 text-xs text-slate-300">ห้อง {lesson.room}</p>
                          </div>
                        ) : (
                          <div className="grid min-h-[92px] place-items-center rounded-2xl border border-dashed border-white/10 text-xs text-slate-500">
                            ว่าง
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden">
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {["ทั้งหมด", ...days].map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                  selectedDay === day ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-slate-200"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
          <div className="grid gap-3">
            {mobileLessons.map((lesson) => (
              <article
                key={`${lesson.day}-${lesson.period}-${lesson.subject}`}
                className={`rounded-2xl border p-4 ${
                  lesson.type === "substitute" ? "border-amber-300/40 bg-amber-300/14" : "border-cyan-300/24 bg-cyan-300/10"
                }`}
              >
                <p className="text-sm text-slate-300">
                  {lesson.day} · คาบ {lesson.period}
                </p>
                <p className="mt-1 font-semibold">{lesson.subject}</p>
                <p className="mt-1 text-xs text-slate-300">ห้อง {lesson.room}</p>
              </article>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard title="การสอนแทน" subtitle="ทั้งที่ฉันต้องไปแทน และที่มีคนมาแทนฉัน">
        <p className="text-sm text-slate-300">ข้อมูลจากตาราง substitutes แยกสองมุมมองในหน้าเดียว</p>
      </GlassCard>

      <GlassCard title="ขอสอนแทน" subtitle="เชื่อมต่อ /api/request-substitute">
        <form className="grid gap-3 md:grid-cols-2" onSubmit={onRequestSubstitute}>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            วันที่
            <input
              type="date"
              value={requestForm.date}
              onChange={(e) => setRequestForm((prev) => ({ ...prev, date: e.target.value }))}
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 outline-none focus:border-cyan-300/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            คาบ
            <input
              value={requestForm.period}
              onChange={(e) => setRequestForm((prev) => ({ ...prev, period: e.target.value }))}
              placeholder="เช่น คาบ 3"
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 outline-none focus:border-cyan-300/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            วิชา
            <input
              value={requestForm.subject}
              onChange={(e) => setRequestForm((prev) => ({ ...prev, subject: e.target.value }))}
              placeholder="Mathematics"
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 outline-none focus:border-cyan-300/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            เหตุผล
            <input
              value={requestForm.reason}
              onChange={(e) => setRequestForm((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="ติดภารกิจราชการ"
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 outline-none focus:border-cyan-300/60"
            />
          </label>
          {requestError ? <p className="md:col-span-2 text-sm text-rose-300">{requestError}</p> : null}
          {requestMessage ? <p className="md:col-span-2 text-sm text-lime-300">{requestMessage}</p> : null}
          <button className="md:col-span-2 rounded-full bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,.35)] transition hover:bg-lime-300">
            ส่งคำขอ
          </button>
        </form>
      </GlassCard>

      <GlassCard title="เปลี่ยนรหัสผ่าน" subtitle="เชื่อมต่อ /api/change-password">
        <form className="grid gap-3 md:grid-cols-3" onSubmit={onChangePassword}>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            รหัสผ่านเดิม
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 outline-none focus:border-cyan-300/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            รหัสผ่านใหม่
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 outline-none focus:border-cyan-300/60"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            ยืนยันรหัสผ่าน
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 outline-none focus:border-cyan-300/60"
            />
          </label>
          {passwordError ? <p className="md:col-span-3 text-sm text-rose-300">{passwordError}</p> : null}
          {passwordMessage ? <p className="md:col-span-3 text-sm text-lime-300">{passwordMessage}</p> : null}
          <button className="md:col-span-3 rounded-full bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,.35)] transition hover:bg-lime-300">
            เปลี่ยนรหัสผ่าน
          </button>
        </form>
      </GlassCard>
    </DashboardLayout>
  );
}
