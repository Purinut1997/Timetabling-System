import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 text-white">
      <p className="text-sm text-white/60">404</p>
      <h1 className="mt-2 text-3xl font-bold">ไม่พบหน้าที่คุณต้องการ</h1>
      <Link href="/" className="mt-6 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">
        กลับหน้าแรก
      </Link>
    </main>
  );
}
