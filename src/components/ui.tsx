"use client";

import Link from "next/link";
import { ReactNode } from "react";

type CardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function GlassCard({ title, subtitle, children, className = "" }: CardProps) {
  return (
    <section
      className={`rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl ${className}`}
    >
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {subtitle ? <p className="text-sm text-white/70">{subtitle}</p> : null}
      </header>
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
  const styles =
    variant === "primary"
      ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
      : "border border-white/30 text-white hover:bg-white/10";

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition ${styles}`}
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
    <label className="flex flex-col gap-2 text-sm text-white/80">
      {label}
      <input
        type={type}
        placeholder={placeholder}
        className="rounded-xl border border-white/20 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
      />
    </label>
  );
}

type DashLayoutProps = {
  title: string;
  role: string;
  nav: { label: string; href: string }[];
  children: ReactNode;
};

export function DashboardLayout({ title, role, nav, children }: DashLayoutProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_20%,#1e293b_0%,#020617_45%)] p-4 text-white md:p-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[260px_1fr]">
        <aside className="rounded-3xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Timetabling System</p>
          <h1 className="mt-2 text-xl font-bold">{title}</h1>
          <p className="mb-4 text-sm text-white/70">{role}</p>
          <nav className="grid gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm transition hover:bg-white/15"
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
