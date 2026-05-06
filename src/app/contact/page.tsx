import { GlassCard } from "@/components/ui";
import { publicContent } from "@/lib/mock-data";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl">
        <GlassCard title="ติดต่อทีมระบบ" subtitle="Support Center">
          <p className="text-sm text-white/80">{publicContent.contactInfo}</p>
        </GlassCard>
      </div>
    </main>
  );
}
