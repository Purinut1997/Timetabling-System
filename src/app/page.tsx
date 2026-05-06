import Link from "next/link";
import { ButtonLink, GlassCard } from "@/components/ui";
import { publicContent } from "@/lib/mock-data";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,#0f172a_0%,#020617_45%)] text-white">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 md:px-8">
        <h1 className="text-lg font-bold tracking-wide">Timetabling System</h1>
        <nav className="hidden gap-5 text-sm text-white/80 md:flex">
          <Link href="/">หน้าแรก</Link>
          <Link href="/about">เกี่ยวกับ</Link>
          <Link href="/contact">ติดต่อ</Link>
        </nav>
        <div className="flex gap-2">
          <ButtonLink href="/login" label="Login" variant="ghost" />
          <ButtonLink href="/register" label="Register" />
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-8 md:grid-cols-3 md:px-8">
        <GlassCard
          title="High-Performance Timetabling"
          subtitle="Modern, Futuristic, Minimalist"
          className="md:col-span-2"
        >
          <p className="text-sm text-white/80">{publicContent.homeAnnouncement}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-cyan-200">
            <span className="rounded-full border border-cyan-200/40 px-3 py-1">Neon PostgreSQL</span>
            <span className="rounded-full border border-cyan-200/40 px-3 py-1">Netlify Functions</span>
            <span className="rounded-full border border-cyan-200/40 px-3 py-1">JWT + RBAC</span>
          </div>
        </GlassCard>

        <GlassCard title="Quick Access" subtitle="Start in one tap">
          <div className="grid gap-2">
            <ButtonLink href="/teacher-dashboard" label="Teacher Dashboard" />
            <ButtonLink href="/admin-dashboard" label="Admin Dashboard" />
            <ButtonLink href="/super-dashboard" label="Super Dashboard" />
          </div>
        </GlassCard>

        <GlassCard title="Contact Info" subtitle="Loaded from system_contents">
          <p className="text-sm text-white/75">{publicContent.contactInfo}</p>
        </GlassCard>

        <GlassCard title="Privacy Policy" subtitle="Loaded from system_contents" className="md:col-span-2">
          <p className="text-sm text-white/75">{publicContent.privacyPolicy}</p>
        </GlassCard>
      </section>
    </main>
  );
}
