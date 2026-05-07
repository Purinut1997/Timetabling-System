"use client";

import { useState, useEffect } from "react";
import { DashboardLayout, GlassCard } from "@/components/ui";
import { Modal } from "@/components/modal";
import { logout, useRequireRole } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  RefreshCw,
  Save,
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield,
  School,
  GraduationCap
} from "lucide-react";

interface User {
  id: number;
  full_name: string;
  email: string;
  role: "teacher" | "school_admin" | "super_admin";
  status: "active" | "inactive" | "suspended";
  school_id: number | null;
  created_at: string;
  updated_at: string;
}

interface School {
  id: number;
  name: string;
}

const ROLES = [
  { value: "teacher", label: "ครู (Teacher)", icon: GraduationCap },
  { value: "school_admin", label: "ผู้ดูแลโรงเรียน (School Admin)", icon: School },
  { value: "super_admin", label: "ผู้ดูแลระบบ (Super Admin)", icon: Shield },
];

const STATUSES = [
  { value: "active", label: "ใช้งาน", color: "bg-green-500/20 text-green-400" },
  { value: "inactive", label: "ไม่ใช้งาน", color: "bg-red-500/20 text-red-400" },
  { value: "suspended", label: "ระงับ", color: "bg-yellow-500/20 text-yellow-400" },
];

export default function UserManagement() {
  const { user, loading } = useRequireRole(["super_admin"]);
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "teacher" | "school_admin" | "super_admin";
    schoolId: string;
    status: "active" | "inactive" | "suspended";
  }>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "teacher",
    schoolId: "",
    status: "active",
  });

  useEffect(() => {
    loadUsers();
    loadSchools();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("tt_token");
      const res = await apiFetch<{ users: User[] }>("admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "โหลดข้อมูลผู้ใช้ไม่สำเร็จ");
    }
  };

  const loadSchools = async () => {
    try {
      const res = await apiFetch<{ schools: School[] }>("schools");
      setSchools(res.schools || []);
    } catch {
      // Silent fail
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || u.role === filterRole;
    const matchesStatus = !filterStatus || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoadingAction(true);
    setError("");
    try {
      const token = localStorage.getItem("tt_token");
      await apiFetch("admin/users", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          schoolId: formData.schoolId,
          status: formData.status,
        }),
      });

      setMessage("สร้างผู้ใช้สำเร็จ!");
      setShowAddForm(false);
      resetForm();
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "สร้างผู้ใช้ไม่สำเร็จ");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    setLoadingAction(true);
    setError("");
    try {
      const token = localStorage.getItem("tt_token");
      await apiFetch("admin/users", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          id: editingUser.id,
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          schoolId: formData.schoolId,
          status: formData.status,
        }),
      });

      setMessage("อัพเดทผู้ใช้สำเร็จ!");
      setShowEditForm(false);
      setEditingUser(null);
      resetForm();
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "อัพเดทผู้ใช้ไม่สำเร็จ");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?")) return;

    try {
      const token = localStorage.getItem("tt_token");
      await apiFetch(`admin/users?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("ลบผู้ใช้สำเร็จ!");
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "ลบผู้ใช้ไม่สำเร็จ");
    }
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setFormData({
      fullName: user.full_name,
      email: user.email,
      password: "",
      confirmPassword: "",
      role: user.role,
      schoolId: user.school_id?.toString() || "",
      status: user.status,
    });
    setShowEditForm(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "teacher",
      schoolId: "",
      status: "active",
    });
  };

  const getRoleLabel = (role: string) => {
    const r = ROLES.find((r) => r.value === role);
    return r?.label || role;
  };

  const getRoleIcon = (role: string) => {
    const r = ROLES.find((r) => r.value === role);
    return r?.icon || Users;
  };

  const getStatusStyle = (status: string) => {
    const s = STATUSES.find((s) => s.value === status);
    return s?.color || "bg-slate-500/20 text-slate-400";
  };

  const getStatusLabel = (status: string) => {
    const s = STATUSES.find((s) => s.value === status);
    return s?.label || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="จัดการผู้ใช้"
      role="Super Admin"
      nav={[
        { label: "ภาพรวม", href: "/super-dashboard" },
        { label: "โรงเรียน", href: "/super-dashboard/schools" },
        { label: "ผู้ใช้", href: "/super-dashboard/users" },
        { label: "เนื้อหา", href: "/super-dashboard/content" },
        { label: "รายงาน", href: "/super-dashboard/reports" },
        { label: "ตั้งค่า", href: "/super-dashboard/settings" },
      ]}
      userName={user?.full_name}
      onLogout={() => {
        logout();
        window.location.href = "/";
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">จัดการผู้ใช้</h1>
            <p className="text-slate-400">สร้างและจัดการผู้ใช้ทั้งหมดในระบบ</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddForm(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
          >
            <Plus className="w-5 h-5" />
            <span>สร้างผู้ใช้</span>
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-auto">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
        {message && (
          <div className="flex items-center gap-2 px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="ml-auto">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อหรืออีเมล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">ทุกบทบาท</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">ทุกสถานะ</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            onClick={loadUsers}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>รีเฟรช</span>
          </button>
        </div>

        {/* Users Table */}
        <GlassCard>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">ผู้ใช้</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">บทบาท</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">สถานะ</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">โรงเรียน</th>
                  <th className="text-left py-3 px-4 text-slate-300 font-medium">สร้างเมื่อ</th>
                  <th className="text-center py-3 px-4 text-slate-300 font-medium">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>ไม่พบผู้ใช้</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const RoleIcon = getRoleIcon(u.role);
                    return (
                      <tr key={u.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                              <span className="text-cyan-400 font-medium">
                                {u.full_name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium">{u.full_name}</p>
                              <p className="text-slate-400 text-sm">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <RoleIcon className="w-4 h-4 text-cyan-400" />
                            <span className="text-slate-300">{getRoleLabel(u.role)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(u.status)}`}>
                            {getStatusLabel(u.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-300">
                            {u.school_id ? schools.find((s) => s.id === u.school_id)?.name || `โรงเรียน #${u.school_id}` : "-"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-400 text-sm">
                            {new Date(u.created_at).toLocaleDateString("th-TH")}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditForm(u)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Create User Modal */}
        {showAddForm && (
          <Modal
            isOpen={showAddForm}
            onClose={() => {
              setShowAddForm(false);
              resetForm();
              setError("");
            }}
            title="สร้างผู้ใช้ใหม่"
          >
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="เช่น สมชาย ใจดี"
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">อีเมล *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@email.com"
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">รหัสผ่าน *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">ยืนยันรหัสผ่าน *</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">บทบาท *</label>
                <div className="grid gap-2">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    return (
                      <label
                        key={r.value}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          formData.role === r.value
                            ? "border-cyan-500 bg-cyan-500/10"
                            : "border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={r.value}
                          checked={formData.role === r.value}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                          className="hidden"
                        />
                        <Icon className="w-5 h-5 text-cyan-400" />
                        <span className="text-white">{r.label}</span>
                        {formData.role === r.value && <CheckCircle className="w-5 h-5 text-cyan-400 ml-auto" />}
                      </label>
                    );
                  })}
                </div>
              </div>

              {(formData.role === "teacher" || formData.role === "school_admin") && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    โรงเรียน {formData.role === "school_admin" && "*"}
                  </label>
                  <select
                    value={formData.schoolId}
                    onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">เลือกโรงเรียน</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">สถานะ</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                    setError("");
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={loadingAction}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
                >
                  {loadingAction ? "กำลังสร้าง..." : "สร้างผู้ใช้"}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Edit User Modal */}
        {showEditForm && editingUser && (
          <Modal
            isOpen={showEditForm}
            onClose={() => {
              setShowEditForm(false);
              setEditingUser(null);
              resetForm();
              setError("");
            }}
            title="แก้ไขผู้ใช้"
          >
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">อีเมล</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">บทบาท</label>
                <div className="grid gap-2">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    return (
                      <label
                        key={r.value}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                          formData.role === r.value
                            ? "border-cyan-500 bg-cyan-500/10"
                            : "border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="editRole"
                          value={r.value}
                          checked={formData.role === r.value}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                          className="hidden"
                        />
                        <Icon className="w-5 h-5 text-cyan-400" />
                        <span className="text-white">{r.label}</span>
                        {formData.role === r.value && <CheckCircle className="w-5 h-5 text-cyan-400 ml-auto" />}
                      </label>
                    );
                  })}
                </div>
              </div>

              {(formData.role === "teacher" || formData.role === "school_admin") && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">โรงเรียน</label>
                  <select
                    value={formData.schoolId}
                    onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">เลือกโรงเรียน</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">สถานะ</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingUser(null);
                    resetForm();
                    setError("");
                  }}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleUpdateUser}
                  disabled={loadingAction}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
                >
                  {loadingAction ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
}
