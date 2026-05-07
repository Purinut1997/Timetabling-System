"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout, GlassCard } from "@/components/ui";
import { logout, useRequireRole } from "@/lib/auth-client";
import { teacherNav } from "@/lib/mock-data";
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Plus,
  Filter,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function TeacherDashboardPage() {
  const { user, loading } = useRequireRole(["teacher"]);
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");

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
      role="role: teacher"
      nav={teacherNav}
      userName={user?.full_name}
      onLogout={onLogout}
    >
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-slate-800/50 rounded-xl backdrop-blur-sm">
        {[
          { id: 'overview', label: 'ภาพรวม', icon: Calendar },
          { id: 'schedule', label: 'ตารางสอน', icon: Clock },
          { id: 'substitute', label: 'การสอนแทน', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeSection === tab.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <GlassCard title="คาบสอนวันนี้">
              <p className="text-3xl font-bold text-cyan-400">4</p>
              <p className="text-sm text-slate-400">คาบทั้งหมด</p>
            </GlassCard>
            <GlassCard title="คาบสอนสัปดาห์นี้">
              <p className="text-3xl font-bold text-green-400">18</p>
              <p className="text-sm text-slate-400">คาบทั้งหมด</p>
            </GlassCard>
            <GlassCard title="คำขอสอนแทน">
              <p className="text-3xl font-bold text-yellow-400">2</p>
              <p className="text-sm text-slate-400">รอดำเนินการ</p>
            </GlassCard>
            <GlassCard title="การสอนแทน">
              <p className="text-3xl font-bold text-purple-400">5</p>
              <p className="text-sm text-slate-400">เดือนนี้</p>
            </GlassCard>
          </section>

          <section className="space-y-6">
            <GlassCard title="ตารางสอนของฉัน">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="font-medium text-white">คณิตศาสตร์ ม.4/1</p>
                      <p className="text-sm text-slate-400">จันทร์ 9:00-10:00</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="font-medium text-white">ภาษาไทย ม.4/2</p>
                      <p className="text-sm text-slate-400">จันทร์ 10:00-11:00</p>
                    </div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="font-medium text-white">วิทยาศาสตร์ ม.4/3</p>
                      <p className="text-sm text-slate-400">จันทร์ 11:00-12:00</p>
                    </div>
                  </div>
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
            </GlassCard>

            <GlassCard title="การกระทำเร็ว">
              <div className="grid gap-3 md:grid-cols-2">
                <Link 
                  href="/teacher-dashboard/substitute-page"
                  className="flex items-center gap-2 px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">ขอสอนแทน</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>
                <Link 
                  href="/teacher-dashboard#schedule"
                  className="flex items-center gap-2 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">ดูตารางสอนทั้งหมด</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>
              </div>
            </GlassCard>
          </section>
        </div>
      )}

      {/* Schedule Section */}
      {activeSection === 'schedule' && (
        <GlassCard title="ตารางสอนทั้งหมด">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหาวิชา..."
                  className="bg-transparent text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
              <select className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500">
                <option>ทุกวิชา</option>
                <option>คณิตศาสตร์</option>
                <option>ภาษาไทย</option>
                <option>วิทยาศาสตร์</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>รีเฟรช</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-separate border-spacing-2">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">วัน/เวลา</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">จันทร์</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">อังคาร</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">พุธ</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">พฤหัสบดี</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-300">ศุกร์</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { time: "08:30-09:20", monday: "คณิตศาสตร์ ม.2/1", tuesday: "คณิตศาสตร์ ม.2/2", wednesday: "คณิตศาสตร์ ม.2/3", thursday: "คณิตศาสตร์ ม.2/4", friday: "คณิตศาสตร์ ม.2/5" },
                    { time: "09:30-10:20", monday: "ภาษาไทย ม.3/1", tuesday: "ภาษาไทย ม.3/2", wednesday: "ภาษาไทย ม.3/3", thursday: "ภาษาไทย ม.3/4", friday: "ภาษาไทย ม.3/5" },
                    { time: "10:40-11:30", monday: "วิทยาศาสตร์ ม.4/1", tuesday: "วิทยาศาสตร์ ม.4/2", wednesday: "วิทยาศาสตร์ ม.4/3", thursday: "วิทยาศาสตร์ ม.4/4", friday: "วิทยาศาสตร์ ม.4/5" },
                    { time: "11:30-12:20", monday: "สังคมศึกษา ม.1/1", tuesday: "สังคมศึกษา ม.1/2", wednesday: "สังคมศึกษา ม.1/3", thursday: "สังคมศึกษา ม.1/4", friday: "สังคมศึกษา ม.1/5" },
                  ].map((row, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-slate-300">{row.time}</td>
                      <td className="px-4 py-3 text-sm text-white">{row.monday}</td>
                      <td className="px-4 py-3 text-sm text-white">{row.tuesday}</td>
                      <td className="px-4 py-3 text-sm text-white">{row.wednesday}</td>
                      <td className="px-4 py-3 text-sm text-white">{row.thursday}</td>
                      <td className="px-4 py-3 text-sm text-white">{row.friday}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Substitute Section */}
      {activeSection === 'substitute' && (
        <div className="space-y-4">
          <GlassCard title="การสอนแทน">
            <div className="text-center py-8">
              <User className="w-16 h-16 mx-auto mb-4 text-cyan-400 opacity-50" />
              <p className="text-xl text-white mb-2">ระบบจัดครูสอนแทน</p>
              <p className="text-slate-400 mb-4">คลิกเพื่อเข้าสู่ระบบจัดการคำขอและอนุมัติการสอนแทน</p>
              <Link 
                href="/teacher-dashboard/substitute-page"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
              >
                <User className="w-5 h-5" />
                <span>เข้าสู่ระบบจัดครูสอนแทน</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </GlassCard>
        </div>
      )}
    </DashboardLayout>
  );
}
