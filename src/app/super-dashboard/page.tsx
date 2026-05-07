"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { DashboardLayout, GlassCard, InputField } from "@/components/ui";
import { logout, useRequireRole } from "@/lib/auth-client";
import { superNav } from "@/lib/mock-data";
import { schoolsAPI, usersAPI, contentAPI, reportsAPI, settingsAPI } from "@/lib/super-api";
import { School, Users, Calendar, Settings, BarChart3, Home, LogOut, Plus, Edit, Trash2, Search, Filter, Download, RefreshCw, AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function SuperDashboardPage() {
  const router = useRouter();
  const { user, loading } = useRequireRole(["super_admin"]);
  const [activeSection, setActiveSection] = useState("overview");
  const [stats, setStats] = useState({
    schools: 0,
    users: 0,
    substitutes: 0,
    pending: 0
  });

  useEffect(() => {
    // Load real stats from API
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const reports = await reportsAPI.getOverview() as any;
      setStats({
        schools: reports.reports.overview.schools,
        users: reports.reports.overview.users,
        substitutes: reports.reports.substitute_stats.total_requests,
        pending: reports.reports.substitute_stats.pending
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Fallback to mock data
      setStats({
        schools: 3,
        users: 154,
        substitutes: 41,
        pending: 9
      });
    }
  };

  if (loading) {
    return <main className="grid min-h-screen place-items-center text-white">กำลังตรวจสอบสิทธิ์...</main>;
  }

  return (
    <DashboardLayout
      title="Super Admin Dashboard"
      role="role: super_admin"
      nav={superNav}
      userName={user?.full_name}
      onLogout={() => {
        logout();
        router.replace("/");
      }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Super Admin Dashboard</h1>
        <p className="text-slate-400">จัดการระบบ Timetbling ทั้งหมด</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-slate-800/50 rounded-xl backdrop-blur-sm">
        {[
          { id: 'overview', label: 'ภาพรวม', icon: Home },
          { id: 'schools', label: 'จัดการโรงเรียน', icon: School },
          { id: 'users', label: 'จัดการผู้ใช้', icon: Users },
          { id: 'content', label: 'จัดการหน้าแรก', icon: Home },
          { id: 'reports', label: 'รายงานสถิติ', icon: BarChart3 },
          { id: 'settings', label: 'ตั้งค่าระบบ', icon: Settings }
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

      {/* Content based on active section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <section className="grid gap-4 md:grid-cols-4">
            {[
              { label: "โรงเรียนทั้งหมด", value: stats.schools, icon: School, color: 'from-blue-500 to-cyan-500' },
              { label: "ผู้ใช้ทั้งหมด", value: stats.users, icon: Users, color: 'from-purple-500 to-pink-500' },
              { label: "สอนแทนเดือนนี้", value: stats.substitutes, icon: Calendar, color: 'from-green-500 to-emerald-500' },
              { label: "บัญชีรอจัดการ", value: stats.pending, icon: Settings, color: 'from-orange-500 to-red-500' }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <GlassCard key={item.label} className="relative overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="w-6 h-6 text-cyan-400" />
                      <span className="text-xs text-slate-400">{item.label}</span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{item.value}</p>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-slate-400">พร้อมใช้งาน</span>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </section>

          {/* Quick Actions */}
          <GlassCard title="การกระทำเร็ว">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <button className="flex items-center gap-2 px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                <span className="text-sm">เพิ่มโรงเรียน</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                <span className="text-sm">เพิ่มผู้ใช้</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">รีเฟรชข้อมูล</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span className="text-sm">ส่งออกรายงาน</span>
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {activeSection === 'schools' && (
        <GlassCard title="จัดการโรงเรียน" subtitle="ฐานข้อมูล schools">
          <SchoolsManagement />
        </GlassCard>
      )}

      {activeSection === 'users' && (
        <GlassCard title="จัดการผู้ใช้ทั้งหมด" subtitle="users + roles + status">
          <UsersManagement />
        </GlassCard>
      )}

      {activeSection === 'content' && (
        <GlassCard title="จัดการเนื้อหาหน้าแรก" subtitle="system_contents">
          <ContentManagement />
        </GlassCard>
      )}

      {activeSection === 'reports' && (
        <GlassCard title="รายงานสถิติ" subtitle="รายงานการใช้งานระบบ">
          <ReportsManagement />
        </GlassCard>
      )}

      {activeSection === 'settings' && (
        <GlassCard title="ตั้งค่าระบบ" subtitle="system_config">
          <SystemSettings />
        </GlassCard>
      )}
    </DashboardLayout>
  );
}

// Component for Schools Management
function SchoolsManagement() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาโรงเรียน..."
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span>เพิ่มโรงเรียน</span>
        </button>
      </div>
      
      <div className="grid gap-3">
        {/* TODO: Add schools list */}
        <div className="text-center py-8 text-slate-400">
          <School className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>ยังไม่มีข้อมูลโรงเรียน</p>
          <p className="text-sm mt-1">กดปุ่ม "เพิ่มโรงเรียน" เพื่อเริ่มต้น</p>
        </div>
      </div>
    </div>
  );
}

// Component for Users Management
function UsersManagement() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาผู้ใช้..."
            className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
          <Filter className="w-4 h-4" />
          <span>กรอง</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span>เพิ่มผู้ใช้</span>
        </button>
      </div>
      
      <div className="grid gap-3">
        {/* TODO: Add users list */}
        <div className="text-center py-8 text-slate-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>ยังไม่มีข้อมูลผู้ใช้</p>
          <p className="text-sm mt-1">กดปุ่ม "เพิ่มผู้ใช้" เพื่อเริ่มต้น</p>
        </div>
      </div>
    </div>
  );
}

// Component for Content Management
function ContentManagement() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">ประกาศหน้าแรก</label>
          <textarea
            placeholder="ป้อนข้อความประกาศ..."
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 resize-none"
            rows={3}
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">ข้อมูลติดต่อ</label>
            <input
              type="text"
              placeholder="อีเมล | เบอร์โทร | ที่อยู่"
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">นโยบายความเป็นส่วนตัว</label>
            <input
              type="text"
              placeholder="รายละเอียดนโยบาย..."
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">เกี่ยวกับเรา</label>
          <textarea
            placeholder="ป้อนข้อมูลเกี่ยวกับระบบ..."
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 resize-none"
            rows={3}
          />
        </div>
        <div className="flex justify-end">
          <button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </div>
    </div>
  );
}

// Component for Reports Management
function ReportsManagement() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <GlassCard title="รายงานผู้ใช้">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">ผู้ใช้ทั้งหมด</span>
              <span className="text-cyan-400 font-semibold">154</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">ผู้ใช้ที่ใช้งานวันนี้</span>
              <span className="text-green-400 font-semibold">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">ผู้ใช้ใหม่เดือนนี้</span>
              <span className="text-purple-400 font-semibold">8</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard title="รายงานการสอนแทน">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">คำขอสอนแทนทั้งหมด</span>
              <span className="text-cyan-400 font-semibold">41</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">ดำเนินการแล้ว</span>
              <span className="text-green-400 font-semibold">35</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">รอดำเนินการ</span>
              <span className="text-orange-400 font-semibold">6</span>
            </div>
          </div>
        </GlassCard>
      </div>
      
      <div className="flex justify-center">
        <button className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          <span>ส่งออกรายงานฉบับเต็ม</span>
        </button>
      </div>
    </div>
  );
}

// Component for System Settings
function SystemSettings() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">จำนวนคาบเรียนต่อวัน</label>
          <input
            type="number"
            defaultValue="9"
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">เวลาต่อคาบ (นาที)</label>
          <input
            type="number"
            defaultValue="50"
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">ปีการศึกษา</label>
          <input
            type="text"
            defaultValue="2026"
            className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">ภาคเรียน</label>
          <select className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500">
            <option value="1">ภาคเรียนที่ 1</option>
            <option value="2">ภาคเรียนที่ 2</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">วันเรียน</label>
        <div className="flex flex-wrap gap-2">
          {['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์'].map((day) => (
            <label key={day} className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-700/50">
              <input type="checkbox" defaultChecked className="text-cyan-500" />
              <span className="text-white">{day}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
          บันทึกการตั้งค่า
        </button>
      </div>
    </div>
  );
}
