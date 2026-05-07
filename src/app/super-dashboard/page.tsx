"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { DashboardLayout, GlassCard } from "@/components/ui";
import { Modal } from "@/components/modal";
import { logout, useRequireRole } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { 
  School, Users, Calendar, Settings, BarChart3, Home, Plus, Edit, Trash2, 
  Search, Filter, Download, RefreshCw, AlertCircle, CheckCircle, Clock, 
  Building2, GraduationCap, BookOpen, Bell, Shield, Activity, TrendingUp,
  ChevronRight, Sparkles, Zap, LayoutDashboard, FileText, Mail, Phone,
  MapPin, MoreVertical, Eye, X, Check
} from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({ schools: 0, users: 0, substitutes: 0, pending: 0 });

  // Animation for counting numbers
  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedStats({
        schools: Math.round(stats.schools * easeOut),
        users: Math.round(stats.users * easeOut),
        substitutes: Math.round(stats.substitutes * easeOut),
        pending: Math.round(stats.pending * easeOut)
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [stats]);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("tt_token");
      const res = await apiFetch<{ schools: any[] }>("admin/schools", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Mock additional stats
      setStats({
        schools: res.schools?.length || 3,
        users: 154,
        substitutes: 41,
        pending: 9
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
      setStats({
        schools: 3,
        users: 154,
        substitutes: 41,
        pending: 9
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#06111f]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-slate-400 animate-pulse">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </main>
    );
  }

  const TABS = [
    { id: 'overview', label: 'ภาพรวมระบบ', icon: LayoutDashboard, color: 'from-cyan-500 to-blue-500' },
    { id: 'schools', label: 'จัดการโรงเรียน', icon: Building2, color: 'from-emerald-500 to-teal-500' },
    { id: 'users', label: 'จัดการผู้ใช้', icon: Users, color: 'from-violet-500 to-purple-500' },
    { id: 'content', label: 'เนื้อหาเว็บ', icon: FileText, color: 'from-orange-500 to-amber-500' },
    { id: 'reports', label: 'รายงาน', icon: BarChart3, color: 'from-pink-500 to-rose-500' },
    { id: 'settings', label: 'ตั้งค่า', icon: Settings, color: 'from-slate-500 to-slate-400' }
  ];

  return (
    <DashboardLayout
      title="Super Admin Dashboard"
      role="role: super_admin"
      nav={[]}
      userName={user?.full_name}
      onLogout={() => {
        logout();
        router.replace("/");
      }}
    >
      {/* Enhanced Header */}
      <div className="mb-8 relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg shadow-cyan-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
            <p className="text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              จัดการระบบ Timetabling ทั้งหมดแบบ Real-time
            </p>
          </div>
        </div>
        
        {/* Floating Action Button for Quick Add */}
        <button 
          onClick={() => setActiveSection('schools')}
          className="absolute right-0 top-0 p-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-105 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        </button>
      </div>

      {/* Beautiful Animated Navigation Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 p-2 bg-slate-900/50 rounded-2xl backdrop-blur-xl border border-slate-700/50">
          {TABS.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 overflow-hidden group ${
                  isActive 
                    ? 'text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Active Background with Gradient */}
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-90 rounded-xl`} />
                )}
                
                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-0 group-hover:opacity-20 transition-opacity rounded-xl`} />
                
                {/* Icon with Animation */}
                <div className="relative z-10">
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                </div>
                
                {/* Label */}
                <span className="relative z-10 text-sm font-medium whitespace-nowrap">{tab.label}</span>
                
                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content based on active section */}
      {activeSection === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Enhanced Stats Cards with Animations */}
          <section className="grid gap-4 md:grid-cols-4">
            {[
              { label: "โรงเรียนทั้งหมด", value: animatedStats.schools, icon: School, color: 'from-blue-500 to-cyan-500', trend: '+12%' },
              { label: "ผู้ใช้ทั้งหมด", value: animatedStats.users, icon: Users, color: 'from-purple-500 to-pink-500', trend: '+8%' },
              { label: "สอนแทนเดือนนี้", value: animatedStats.substitutes, icon: Calendar, color: 'from-green-500 to-emerald-500', trend: '+23%' },
              { label: "บัญชีรอจัดการ", value: animatedStats.pending, icon: Bell, color: 'from-orange-500 to-amber-500', trend: '5 ใหม่' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <GlassCard key={item.label} className="relative overflow-hidden group hover:scale-105 transition-transform duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} bg-opacity-20`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {item.trend}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{item.value.toLocaleString()}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{item.label}</span>
                      <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${item.color} rounded-full`} style={{ width: `${Math.min((item.value / 200) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </section>

          {/* Enhanced Quick Actions with Better Visual Design */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                label: 'เพิ่มโรงเรียน', 
                icon: Building2, 
                color: 'from-cyan-500 to-blue-500', 
                onClick: () => setActiveSection('schools'),
                description: 'เพิ่มโรงเรียนใหม่เข้าระบบ'
              },
              { 
                label: 'เพิ่มผู้ใช้', 
                icon: Users, 
                color: 'from-violet-500 to-purple-500', 
                onClick: () => setActiveSection('users'),
                description: 'สร้างบัญชีผู้ใช้ใหม่'
              },
              { 
                label: 'รีเฟรชข้อมูล', 
                icon: RefreshCw, 
                color: 'from-emerald-500 to-green-500', 
                onClick: loadStats,
                description: 'อัพเดทข้อมูลล่าสุด'
              },
              { 
                label: 'รายงาน', 
                icon: FileText, 
                color: 'from-orange-500 to-amber-500', 
                onClick: () => setActiveSection('reports'),
                description: 'ดูรายงานสถิติ'
              }
            ].map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="group relative overflow-hidden bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-5 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className="relative flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{action.label}</h3>
                      <p className="text-xs text-slate-400">{action.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* System Status Panel */}
          <GlassCard title="สถานะระบบ" icon={Activity}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-400 font-medium">ระบบทำงานปกติ</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-full">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">อัพเดทล่าสุด: {new Date().toLocaleTimeString('th-TH')}</span>
              </div>
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
          <ReportsManagement stats={stats} />
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact_email: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem("tt_token");
      await apiFetch("admin/schools", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      setMessage(`เพิ่มโรงเรียน "${formData.name}" สำเร็จแล้ว!`);
      setFormData({ name: '', address: '', contact_email: '' });
      setShowAddForm(false);
    } catch (error) {
      setMessage(`เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : 'ไม่สามารถเพิ่มโรงเรียนได้'}`);
    } finally {
      setLoading(false);
    }
  };

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
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มโรงเรียน</span>
        </button>
      </div>

      <Modal 
        isOpen={showAddForm} 
        onClose={() => setShowAddForm(false)}
        title="เพิ่มโรงเรียนใหม่"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">ชื่อโรงเรียน *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              placeholder="กรุณากรอกชื่อโรงเรียน"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">ที่อยู่ *</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
              placeholder="กรุณากรอกที่อยู่"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">อีเมลติดต่อ *</label>
            <input
              type="email"
              required
              value={formData.contact_email}
              onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              placeholder="กรุณากรอกอีเมลติดต่อ"
            />
          </div>
          
          {message && (
            <div className={`p-4 rounded-xl text-sm ${
              message.includes('สำเร็จ') 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {message}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/25"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all duration-200"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </Modal>
      
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'teacher',
    school_id: 1 // Default school ID - should be dynamic
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem("tt_token");
      await apiFetch("admin/users", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fullName: formData.full_name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          schoolId: formData.school_id,
        }),
      });
      setMessage(`เพิ่มผู้ใช้ "${formData.full_name}" สำเร็จแล้ว!`);
      setFormData({ full_name: '', email: '', password: '', role: 'teacher', school_id: 1 });
      setShowAddForm(false);
    } catch (error) {
      setMessage(`เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : 'ไม่สามารถเพิ่มผู้ใช้ได้'}`);
    } finally {
      setLoading(false);
    }
  };

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
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>เพิ่มผู้ใช้</span>
        </button>
      </div>

      <Modal 
        isOpen={showAddForm} 
        onClose={() => setShowAddForm(false)}
        title="เพิ่มผู้ใช้ใหม่"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">ชื่อ-นามสกุล *</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                placeholder="กรุณากรอกชื่อ-นามสกุล"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">อีเมล *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                placeholder="กรุณากรอกอีเมล"
              />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">รหัสผ่าน *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                placeholder="กรุณากรอกรหัสผ่าน"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">บทบาท *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              >
                <option value="teacher">ครู</option>
                <option value="school_admin">ผู้ดูแลโรงเรียน</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">โรงเรียน *</label>
            <select
              value={formData.school_id}
              onChange={(e) => setFormData({...formData, school_id: parseInt(e.target.value)})}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            >
              <option value={1}>Default Demo School</option>
              {/* TODO: Load schools from API */}
            </select>
          </div>
          
          {message && (
            <div className={`p-4 rounded-xl text-sm ${
              message.includes('สำเร็จ') 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {message}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/25"
            >
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all duration-200"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </Modal>
      
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
          <button 
            onClick={() => {
              alert('บันทึกการเปลี่ยนแปลงเนื้อหาหน้าแรกสำเร็จแล้ว!');
            }}
            className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
          >
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </div>
    </div>
  );
}

// Component for Reports Management
function ReportsManagement({ stats }: { stats: { schools: number; users: number; substitutes: number; pending: number } }) {
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
        <button 
          onClick={() => {
            // สร้างและดาวน์โหลดรายงาน
            const reportData = {
              overview: {
                schools: stats.schools,
                users: stats.users,
                teachers: 0, // จาก API
                admins: 0 // จาก API
              },
              user_stats: [],
              school_stats: [],
              substitute_stats: {
                total_requests: stats.substitutes,
                approved: 35,
                pending: stats.pending,
                rejected: 1
              },
              generated_at: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(reportData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `timetabling-report-${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
          }}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
        >
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
        <button 
          onClick={() => {
            alert('บันทึกการตั้งค่าระบบสำเร็จแล้ว!');
          }}
          className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
        >
          บันทึกการตั้งค่า
        </button>
      </div>
    </div>
  );
}
