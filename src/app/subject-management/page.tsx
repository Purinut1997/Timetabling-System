"use client";

import { useState, useEffect } from "react";
import { DashboardLayout, GlassCard } from "@/components/ui";
import { Modal } from "@/components/modal";
import { logout, useRequireRole } from "@/lib/auth-client";
import { teacherNav } from "@/lib/mock-data";
import { 
  Search, 
  BookOpen, 
  Edit, 
  Trash2, 
  Plus,
  Filter,
  RefreshCw,
  Save,
  Users,
  Clock,
  Calendar,
  AlertCircle
} from "lucide-react";

// Type definitions
interface Subject {
  id: number;
  code: string;
  name: string;
  description: string;
  credits: number;
  category: string;
  grade_levels: string[];
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

interface Teacher {
  id: number;
  name: string;
  email: string;
  subject_ids: number[];
  status: 'active' | 'inactive';
}

// Mock data for demonstration
const mockSubjects: Subject[] = [
  {
    id: 1,
    code: "MATH101",
    name: "คณิตศาสตร์",
    description: "คณิตศาสตร์พื้นฐาน",
    credits: 3,
    category: "วิทยาศาสตร์",
    grade_levels: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"],
    status: "active" as const,
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  },
  {
    id: 2,
    code: "THAI101",
    name: "ภาษาไทย",
    description: "ภาษาไทยสำหรับการสื่อสัมพันธุ์",
    credits: 2,
    category: "ภาษาศาสตร์",
    grade_levels: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"],
    status: "active" as const,
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  },
  {
    id: 3,
    code: "SCI101",
    name: "วิทยาศาสตร์",
    description: "วิทยาศาสตร์พื้นฐานและการทดลอง",
    credits: 3,
    category: "วิทยาศาสตร์",
    grade_levels: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"],
    status: "active" as const,
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  },
  {
    id: 4,
    code: "ENG101",
    name: "ภาษาอังกฤษ",
    description: "ภาษาอังกฤษสำหรับการสื่อสัมพันธุ์",
    credits: 2,
    category: "ภาษาศาสตร์",
    grade_levels: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"],
    status: "active" as const,
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  },
  {
    id: 5,
    code: "SOC101",
    name: "สังคมศึกษา",
    description: "สังคมศึกษาเพื่อความรู้และสังคม",
    credits: 2,
    category: "สังคมศึกษา",
    grade_levels: ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"],
    status: "active" as const,
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  }
];

const mockTeachers: Teacher[] = [
  { 
    id: 1, 
    name: "ครูสมศรี ใจดี", 
    email: "somsri@school.com", 
    subject_ids: [1, 2],
    status: "active" as const
  },
  { 
    id: 2, 
    name: "ครูวิชัย รักงาน", 
    email: "wichai@school.com", 
    subject_ids: [3, 4],
    status: "active" as const
  },
  { 
    id: 3, 
    name: "ครูนภา สอนดี", 
    email: "napa@school.com", 
    subject_ids: [5],
    status: "active" as const
  }
];

const categories = ["ทุกประเภท", "วิทยาศาสตร์", "ภาษาศาสตร์", "สังคมศึกษา", "ศิลปศาสตร์", "พลศึกษา", "ศิลปศาสตร์"];

export default function SubjectManagement() {
  const { user, loading } = useRequireRole(["teacher", "school_admin", "super_admin"]);
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    credits: "",
    category: "",
    grade_levels: [] as string[],
    status: "active" as const
  });

  useEffect(() => {
    // Load subjects from API
    // apiFetch("/subjects")
    //   .then((data) => setSubjects(data))
    //   .catch(() => {});
    // apiFetch("/teachers")
    //   .then((data) => setTeachers(data))
    //   .catch(() => {});
  }, []);

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || subject.category === filterCategory;
    const matchesStatus = !filterStatus || subject.status === filterStatus;
    const matchesGrade = !filterGrade || subject.grade_levels.some(grade => grade.includes(filterGrade));
    
    return matchesSearch && matchesCategory && matchesStatus && matchesGrade;
  });

  const handleAddSubject = () => {
    setLoadingAction(true);
    
    const newSubject: Subject = {
      id: subjects.length + 1,
      code: formData.code,
      name: formData.name,
      description: formData.description,
      credits: parseInt(formData.credits),
      category: formData.category,
      grade_levels: formData.grade_levels,
      status: formData.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setSubjects([...subjects, newSubject]);
    setShowAddForm(false);
    setFormData({
      code: "",
      name: "",
      description: "",
      credits: "",
      category: "",
      grade_levels: [] as string[],
      status: "active" as const
    });
    setLoadingAction(false);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      code: subject.code,
      name: subject.name,
      description: subject.description,
      credits: subject.credits.toString(),
      category: subject.category,
      grade_levels: subject.grade_levels,
      status: subject.status
    });
    setShowAddForm(true);
  };

  const handleUpdateSubject = () => {
    if (!editingSubject) return;
    
    setLoadingAction(true);
    
    const updatedSubjects = subjects.map(s => 
      s.id === editingSubject.id 
        ? {
            ...s,
            code: formData.code,
            name: formData.name,
            description: formData.description,
            credits: parseInt(formData.credits),
            category: formData.category,
            grade_levels: formData.grade_levels,
            status: formData.status,
            updated_at: new Date().toISOString()
          }
        : s
    );
    
    setSubjects(updatedSubjects);
    setShowAddForm(false);
    setEditingSubject(null);
    setLoadingAction(false);
  };

  const handleDeleteSubject = (id: number) => {
    if (confirm("คุณต้องการลบวิชานี้ใช่หรือไม่?")) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "inactive": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "archived": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "ใช้งาน";
      case "inactive": return "ไม่ใช้งาน";
      case "archived": return "เก็บข้อมูล";
      default: return status;
    }
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
      title="จัดการวิชา"
      role="School Admin"
      nav={teacherNav}
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
            <h1 className="text-3xl font-bold text-white mb-2">จัดการวิชา</h1>
            <p className="text-slate-400">จัดการข้อมูลวิชา และครูผู้สอน</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
          >
            <Plus className="w-5 h-5" />
            <span>เพิ่มวิชา</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาวิชาหรือรหัสวิชา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">ทุกประเภท</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">ทุกสถานะ</option>
            <option value="active">ใช้งาน</option>
            <option value="inactive">ไม่ใช้งาน</option>
            <option value="archived">เก็บข้อมูล</option>
          </select>
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">ทุกระดับชั้น</option>
            <option value="ม.1">ม.1</option>
            <option value="ม.2">ม.2</option>
            <option value="ม.3">ม.3</option>
            <option value="ม.4">ม.4</option>
            <option value="ม.5">ม.5</option>
            <option value="ม.6">ม.6</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>รีเฟรช</span>
          </button>
        </div>

        {/* Subject Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.length === 0 ? (
            <GlassCard>
              <div className="text-center py-12 text-slate-400">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl mb-2">ไม่พบวิชา</p>
                <p>ลองปรับเปลี่ยนเงื่อนไขการค้นหา</p>
              </div>
            </GlassCard>
          ) : (
            filteredSubjects.map((subject) => (
              <GlassCard key={subject.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-medium text-white">{subject.name}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(subject.status)}`}>
                    {getStatusText(subject.status)}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <AlertCircle className="w-4 h-4" />
                    <span>รหัสวิชา: {subject.code}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users className="w-4 h-4" />
                    <span>หมวกวิชา: {subject.credits} หน่วย</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <BookOpen className="w-4 h-4" />
                    <span>ประเภท: {subject.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-4 h-4" />
                    <span>ระดับชั้น: {subject.grade_levels.join(", ")}</span>
                  </div>
                  <div className="text-slate-300">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    <span className="text-xs">สร้าง: {new Date(subject.created_at).toLocaleDateString('th-TH')}</span>
                  </div>
                  <div className="text-slate-300">
                    <p className="text-xs mb-1">คำอธิบาย:</p>
                    <p className="text-xs">{subject.description}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditSubject(subject)}
                    className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subject.id)}
                    className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            ))
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddForm && (
          <Modal
            isOpen={showAddForm}
            onClose={() => {
              setShowAddForm(false);
              setEditingSubject(null);
              setFormData({
                code: "",
                name: "",
                description: "",
                credits: "",
                category: "",
                grade_levels: [] as string[],
                status: "active" as const
              });
            }}
            title={editingSubject ? "แก้ไขข้อมูลวิชา" : "เพิ่มวิชาใหม่"}
          >
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">รหัสวิชา *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="MATH101"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">ชื่อวิชา *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="คณิตศาสตร์"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">คำอธิบาย *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="ระบุวิชานี้..."
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
              
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">หมวกวิชา *</label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({...formData, credits: e.target.value})}
                    placeholder="3"
                    min="1"
                    max="10"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">ประเภท *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">เลือกประเภท</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">ระดับชั้น *</label>
                <div className="space-y-2">
                  {["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"].map(grade => (
                    <label key={grade} className="flex items-center gap-2 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={formData.grade_levels.includes(grade)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, grade_levels: [...formData.grade_levels, grade]});
                          } else {
                            setFormData({...formData, grade_levels: formData.grade_levels.filter(g => g !== grade)});
                          }
                        }}
                        className="rounded border-slate-600 bg-slate-800/50 text-cyan-400 focus:ring-cyan-500"
                      />
                      <span>{grade}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">สถานะ *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="active">ใช้งาน</option>
                  <option value="inactive">ไม่ใช้งาน</option>
                  <option value="archived">เก็บข้อมูล</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={editingSubject ? handleUpdateSubject : handleAddSubject}
                  disabled={loadingAction}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
                >
                  {loadingAction ? (
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" />
                      <span>{editingSubject ? "อัพเดท" : "บันทึก"}</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
}
