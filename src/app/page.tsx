 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ButtonLink, GlassCard } from "@/components/ui";
import { publicContent } from "@/lib/mock-data";
import { apiFetch } from "@/lib/api";

export default function Home() {
  const [content, setContent] = useState(publicContent);

  useEffect(() => {
    apiFetch<{
      home_announcement?: string;
      contact_info?: string;
      privacy_policy?: string;
    }>("public-content")
      .then((data) => {
        setContent({
          homeAnnouncement: data.home_announcement || publicContent.homeAnnouncement,
          contactInfo: data.contact_info || publicContent.contactInfo,
          privacyPolicy: data.privacy_policy || publicContent.privacyPolicy,
        });
      })
      .catch(() => {
        // Keep default content if API is unavailable.
      });
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06111f] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,.22),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(132,204,22,.14),transparent_28%),linear-gradient(135deg,#06111f_0%,#0b1730_48%,#101827_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:42px_42px]" />
      <header className="sticky top-0 z-40 mx-auto flex w-full max-w-7xl items-center justify-between border-b border-white/10 bg-[#06111f]/75 px-4 py-6 backdrop-blur-2xl md:px-8">
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

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-8 pt-8 md:grid-cols-3 md:px-8">
        <GlassCard
          title="High-Performance Timetabling"
          subtitle="Modern, Futuristic, Minimalist"
          className="md:col-span-2"
        >
          <p className="text-sm text-white/80">{content.homeAnnouncement}</p>
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
          <p className="text-sm text-white/75">{content.contactInfo}</p>
        </GlassCard>

        <GlassCard title="Privacy Policy" subtitle="Loaded from system_contents" className="md:col-span-2">
          <p className="text-sm text-white/75">{content.privacyPolicy}</p>
        </GlassCard>
      </section>
    </main>
  );
}
