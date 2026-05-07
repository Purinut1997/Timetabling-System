"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

type CardProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function GlassCard({ title, subtitle, children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-[2rem] border border-white/12 bg-white/[0.07] p-6 shadow-[0_24px_70px_rgba(0,0,0,.28)] backdrop-blur-2xl ${className}`}
    >
      {title && (
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
          {subtitle ? <p className="text-sm text-slate-300/90">{subtitle}</p> : null}
        </header>
      )}
      {children}
    </section>
  );
}

type ButtonLinkProps = {
  href: string;
  label: string;
  variant?: "primary" | "ghost";
};

export function ButtonLink({ href, label, variant = "primary" }: ButtonLinkProps) {
  const router = useRouter();
  const styles =
    variant === "primary"
      ? "bg-cyan-300 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,.35)] hover:bg-lime-300"
      : "border border-white/20 bg-white/[0.04] text-white hover:border-cyan-300/50 hover:bg-white/[0.1]";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.replace(href);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${styles}`}
    >
      {label}
    </Link>
  );
}

type InputProps = {
  label: string;
  type?: string;
  placeholder?: string;
};

export function InputField({ label, type = "text", placeholder }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-200">
      {label}
      <input
        type={type}
        placeholder={placeholder}
        className="rounded-2xl border border-white/12 bg-slate-950/30 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
      />
    </label>
  );
}

type DashLayoutProps = {
  title: string;
  role: string;
  nav: { label: string; href: string }[];
  userName?: string;
  onLogout?: () => void;
  children: ReactNode;
};

export function DashboardLayout({ title, role, nav, userName, onLogout, children }: DashLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06111f] p-4 text-white md:p-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,.22),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(132,204,22,.14),transparent_28%),linear-gradient(135deg,#06111f_0%,#0b1730_48%,#101827_100%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[280px_1fr]">
        <aside className="rounded-[2rem] border border-white/12 bg-white/[0.07] p-5 backdrop-blur-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Timetabling System</p>
          <h1 className="mt-2 text-xl font-bold">{title}</h1>
          <p className="mb-4 text-sm text-slate-300/90">{role}</p>
          {userName ? <p className="mb-3 text-xs text-cyan-100/80">ผู้ใช้งาน: {userName}</p> : null}
          {onLogout ? (
            <button
              onClick={onLogout}
              className="mb-4 w-full rounded-full border border-white/20 bg-white/[0.04] px-3 py-2 text-sm transition hover:border-cyan-300/50 hover:bg-white/[0.1]"
            >
              ออกจากระบบ
            </button>
          ) : null}
          <nav className="grid gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-transparent bg-white/[0.02] px-3 py-2 text-sm transition hover:border-cyan-300/40 hover:bg-white/[0.08]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="space-y-4">{children}</section>
      </div>
    </main>
  );
}
