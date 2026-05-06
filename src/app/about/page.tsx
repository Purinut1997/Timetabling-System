import { GlassCard } from "@/components/ui";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl">
        <GlassCard title="เกี่ยวกับระบบ" subtitle="Timetabling System Platform">
          <p className="text-sm text-white/80">
            ระบบนี้ออกแบบมาเพื่อช่วยโรงเรียนบริหารตารางสอนและการสอนแทนแบบมีประสิทธิภาพสูง รองรับการใช้งานทั้งมือถือและเดสก์ท็อป
            ด้วยโครงสร้างที่พร้อมขยายในระดับหลายโรงเรียน
          </p>
        </GlassCard>
      </div>
    </main>
  );
}
