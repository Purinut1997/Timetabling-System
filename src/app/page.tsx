"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  FileSpreadsheet,
  GraduationCap,
  LayoutDashboard,
  LockKeyhole,
  Megaphone,
  Phone,
  School,
  Search,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { publicContent } from "@/lib/mock-data";
import { AuthPopup } from "@/components/auth-popup";

const announcements = [
  { title: "เปิดใช้งานระบบตารางสอนออนไลน์", detail: "ครูสามารถตรวจตารางสอนรายสัปดาห์และรายการสอนแทนได้จากทุกอุปกรณ์", date: "6 พ.ค. 2569" },
  { title: "แนวทางนำเข้าข้อมูลจาก Google Sheet", detail: "แอดมินโรงเรียนควรตรวจรูปแบบคอลัมน์ก่อนนำเข้า", date: "5 พ.ค. 2569" },
  { title: "Super Admin แก้ไขหน้าแรกได้", detail: "ประกาศ ข้อมูลติดต่อ และนโยบายถูกจัดการผ่าน system_contents", date: "4 พ.ค. 2569" },
];

export default function Home() {
  const [content, setContent] = useState(publicContent);
  const [authPopup, setAuthPopup] = useState<{ open: boolean; mode: "login" | "register" }>({
    open: false,
    mode: "login",
  });

  useEffect(() => {
    apiFetch<{ home_announcement?: string; contact_info?: string; privacy_policy?: string }>("public-content")
      .then((data) =>
        setContent({
          homeAnnouncement: data.home_announcement || publicContent.homeAnnouncement,
          contactInfo: data.contact_info || publicContent.contactInfo,
          privacyPolicy: data.privacy_policy || publicContent.privacyPolicy,
        }),
      )
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#06111f] text-slate-50">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,.22),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(132,204,22,.14),transparent_28%),linear-gradient(135deg,#06111f_0%,#0b1730_48%,#101827_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:42px_42px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06111f]/75 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_30px_rgba(34,211,238,.22)]">
              <CalendarDays className="h-6 w-6 text-cyan-200" />
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-wide">ตารางสอน OS</span>
              <span className="block text-xs text-cyan-100/60">School Schedule Platform</span>
            </span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-slate-200/80 md:flex">
            <a href="#about" className="transition hover:text-cyan-200">เกี่ยวกับระบบ</a>
            <a href="#dashboard" className="transition hover:text-cyan-200">แดชบอร์ด</a>
            <a href="#features" className="transition hover:text-cyan-200">ฟังก์ชัน</a>
            <a href="#contact" className="transition hover:text-cyan-200">ติดต่อ</a>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => setAuthPopup({ open: true, mode: "login" })}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-100 transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
            >
              เข้าสู่ระบบ
            </button>
            <button
              onClick={() => setAuthPopup({ open: true, mode: "register" })}
              className="rounded-full bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,.35)] transition hover:bg-lime-300"
            >
              สมัครสมาชิก
            </button>
          </div>
        </nav>
      </header>

      <section className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28 lg:pt-16">
        <div className="relative z-10 flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,.14)]">
            <Sparkles className="h-4 w-4" /> ระบบตารางสอนออนไลน์สำหรับโรงเรียนยุคใหม่
          </div>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-7xl">
            จัดตารางสอนและสอนแทนให้ชัดเจนในหน้าจอเดียว
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200/78">{content.homeAnnouncement}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#dashboard" className="group inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 font-semibold text-slate-950 shadow-[0_0_36px_rgba(34,211,238,.36)] transition hover:bg-lime-300">
              ดูแดชบอร์ดตัวอย่าง <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </a>
            <button
              onClick={() => setAuthPopup({ open: true, mode: "login" })}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/8 px-6 py-3 font-semibold text-white backdrop-blur-xl transition hover:border-cyan-300/50 hover:bg-white/12"
            >
              <LockKeyhole className="h-5 w-5" /> เข้าสู่ระบบ
            </button>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/[0.06] shadow-[0_30px_90px_rgba(0,0,0,.35)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(34,211,238,.22),rgba(6,17,31,.65)),url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-[#06111f]/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 rounded-[2rem] border border-white/15 bg-slate-950/50 p-5 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[.3em] text-cyan-100/70">Live Overview</p>
                <h2 className="mt-1 text-2xl font-semibold">ตารางสอนสัปดาห์นี้</h2>
              </div>
              <span className="rounded-full bg-lime-300/90 px-3 py-1 text-xs font-bold text-slate-950">พร้อมใช้งาน</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-2xl bg-cyan-300/12 p-3"><Clock3 className="mb-2 h-4 w-4 text-cyan-200" />6 คาบ/วัน</div>
              <div className="rounded-2xl bg-amber-300/12 p-3"><Bell className="mb-2 h-4 w-4 text-amber-200" />2 คาบสอนแทน</div>
              <div className="rounded-2xl bg-lime-300/12 p-3"><CheckCircle2 className="mb-2 h-4 w-4 text-lime-200" />ครูว่าง 7 คน</div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-[2rem] border border-white/12 bg-white/[0.06] p-6 backdrop-blur-xl">
            <p className="text-sm font-semibold text-cyan-200">Public Home</p>
            <h2 className="mt-3 text-3xl font-semibold">หน้าแรกที่ Super Admin ปรับเนื้อหาได้</h2>
            <p className="mt-4 leading-7 text-slate-300">{content.privacyPolicy}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {announcements.map((item) => (
              <article key={item.title} className="group rounded-[2rem] border border-white/12 bg-white/[0.07] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/35">
                <Megaphone className="h-6 w-6 text-cyan-200" />
                <p className="mt-4 text-xs text-slate-400">{item.date}</p>
                <h3 className="mt-2 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300/85">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.25em] text-cyan-200/80">Role-based Workspace</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">พื้นที่ทำงานตามบทบาท</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { icon: GraduationCap, label: "Teacher", href: "/teacher-dashboard" },
            { icon: School, label: "School Admin", href: "/admin-dashboard" },
            { icon: ShieldCheck, label: "Super Admin", href: "/super-dashboard" },
            { icon: Users, label: "Users", href: "/login" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="rounded-[1.75rem] border border-white/12 bg-white/[0.07] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/35">
              <item.icon className="h-6 w-6 text-cyan-200" />
              <div className="mt-3 text-lg font-semibold">{item.label}</div>
            </Link>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: LockKeyhole, title: "Login / Register", detail: "ฟอร์มอีเมล รหัสผ่าน ลืมรหัสผ่าน และสมัครครูใหม่พร้อมเลือกโรงเรียน" },
            { icon: UserCog, title: "Role Redirect", detail: "หลังเข้าสู่ระบบนำทางไปยัง teacher, school_admin หรือ super_admin ตามบทบาท" },
            { icon: LayoutDashboard, title: "Dashboard Cockpit", detail: "ตารางสอนแบบ desktop grid + mobile cards พร้อมค่าสถิติสำคัญ" },
            { icon: Download, title: "Export Ready", detail: "รองรับการต่อยอด export PDF/CSV จากมุมมองตารางสอนได้ทันที" },
            { icon: FileSpreadsheet, title: "Google Sheet Ready", detail: "โครงสร้างระบบรองรับการเชื่อมข้อมูลภายนอกในเฟสถัดไป" },
            { icon: Search, title: "Quick Find", detail: "มีจุดเตรียมสำหรับค้นหาวิชา ห้อง และครูในช่วงเวลาเดียวกัน" },
          ].map((feature) => (
            <div key={feature.title} className="rounded-[1.75rem] border border-white/10 bg-slate-950/22 p-5 transition hover:-translate-y-1 hover:border-cyan-300/35">
              <feature.icon className="h-6 w-6 text-cyan-200" />
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300/86">{feature.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <footer id="contact" className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-white/12 bg-slate-950/38 p-6 backdrop-blur-2xl md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">ตารางสอน OS</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">พร้อมใช้งานบน Netlify + Neon และปรับต่อได้สำหรับ production workflow เต็มรูปแบบ</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 md:mt-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-sm"><Phone className="h-4 w-4" /> {content.contactInfo}</span>
          </div>
        </div>
      </footer>
      <AuthPopup
        key={`${authPopup.open}-${authPopup.mode}`}
        isOpen={authPopup.open}
        initialMode={authPopup.mode}
        onClose={() => setAuthPopup((prev) => ({ ...prev, open: false }))}
      />
    </main>
  );
}
