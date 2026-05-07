"use client";

import { useState, useEffect } from "react";
import { DashboardLayout, GlassCard } from "@/components/ui";
import { Modal } from "@/components/modal";
import { logout, useRequireRole } from "@/lib/auth-client";
import { teacherNav } from "@/lib/mock-data";
import { 
  Search, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Plus,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Save,
  GraduationCap,
  Calendar,
  Mail,
  Phone
} from "lucide-react";

// Type definitions
interface Student {
  id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  grade: string;
  classroom_id: number;
  classroom_name: string;
  gender: 'male' | 'female';
  birth_date: string;
  address: string;
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  enrollment_date: string;
  created_at: string;
  updated_at: string;
}

interface Classroom {
  id: number;
  name: string;
  room_number: string;
  building: string;
  floor: string;
  capacity: number;
  current_students: number;
}

// Mock data for demonstration
const mockStudents: Student[] = [
  {
    id: 1,
    student_id: "6401012345",
    first_name: "นายสมใจ",
    last_name: "จิตรัญญู",
    email: "namsai@student.com",
    phone: "081-234-5678",
    grade: "ม.4/1",
    classroom_id: 1,
    classroom_name: "ห้อง 301",
    gender: "male" as const,
    birth_date: "2008-05-15",
    address: "123 ถน. พระราษม เขต กรุงเทพ กรุงเทพ 10100",
    parent_name: "คุณสมศรี ใจดี",
    parent_phone: "081-987-6543",
    parent_email: "somsri@parent.com",
    status: "active" as const,
    enrollment_date: "2024-05-07T07:30:00Z",
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  },
  {
    id: 2,
    student_id: "6401012346",
    first_name: "มานี",
    last_name: "มีความ",
    email: "manee@student.com",
    phone: "081-234-5679",
    grade: "ม.4/2",
    classroom_id: 1,
    classroom_name: "ห้อง 301",
    gender: "female" as const,
    birth_date: "2008-08-20",
    address: "456 ถน. สุขุมรีมี กรุงเทพ กรุงเทพ 10200",
    parent_name: "คุณวิชัย รักการเรียน",
    parent_phone: "081-876-5432",
    parent_email: "wichai@parent.com",
    status: "active" as const,
    enrollment_date: "2024-05-07T07:30:00Z",
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  },
  {
    id: 3,
    student_id: "6401012347",
    first_name: "วิชัย",
    last_name: "รักการเรียน",
    email: "wichai@student.com",
    phone: "081-234-5680",
    grade: "ม.5/1",
    classroom_id: 2,
    classroom_name: "ห้อง 302",
    gender: "male" as const,
    birth_date: "2007-12-10",
    address: "789 ถน. หาวใหญ่ กรุงเทพ กรุงเทพ 10300",
    parent_name: "คุณนภา สอนดี",
    parent_phone: "081-765-4321",
    parent_email: "napa@parent.com",
    status: "active" as const,
    enrollment_date: "2024-05-07T07:30:00Z",
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  }
];

const mockClassrooms: Classroom[] = [
  { 
    id: 1, 
    name: "ห้อง 301", 
    room_number: "301",
    building: "อาคาร 1",
    floor: "3",
    capacity: 40,
    current_students: 35
  },
  { 
    id: 2, 
    name: "ห้อง 302", 
    room_number: "302",
    building: "อาคาร 1",
    floor: "3",
    capacity: 35,
    current_students: 32
  },
  { 
    id: 3, 
    name: "ห้อง 401", 
    room_number: "401",
    building: "อาคาร 4",
    floor: "4",
    capacity: 30,
    current_students: 28
  }
];

const grades = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];

export default function StudentManagement() {
  const { user, loading } = useRequireRole(["teacher", "school_admin", "super_admin"]);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [classrooms, setClassrooms] = useState<Classroom[]>(mockClassrooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterClassroom, setFilterClassroom] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const [formData, setFormData] = useState({
    student_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    grade: "",
    classroom_id: "",
    gender: "male" as const,
    birth_date: "",
    address: "",
    parent_name: "",
    parent_phone: "",
    parent_email: "",
    status: "active" as const
  });

  useEffect(() => {
    // Load students from API
    // apiFetch("/students")
    //   .then((data) => setStudents(data))
    //   .catch(() => {});
    // apiFetch("/classrooms")
    //   .then((data) => setClassrooms(data))
    //   .catch(() => {});
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = !filterGrade || student.grade === filterGrade;
    const matchesClassroom = !filterClassroom || student.classroom_name.includes(filterClassroom);
    const matchesStatus = !filterStatus || student.status === filterStatus;
    
    return matchesSearch && matchesGrade && matchesClassroom && matchesStatus;
  });

  const handleAddStudent = () => {
    setLoadingAction(true);
    
    const newStudent: Student = {
      id: students.length + 1,
      student_id: formData.student_id,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      grade: formData.grade,
      classroom_id: parseInt(formData.classroom_id),
      classroom_name: classrooms.find(c => c.id === parseInt(formData.classroom_id))?.name || "",
      gender: formData.gender,
      birth_date: formData.birth_date,
      address: formData.address,
      parent_name: formData.parent_name,
      parent_phone: formData.parent_phone,
      parent_email: formData.parent_email,
      status: formData.status,
      enrollment_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setStudents([...students, newStudent]);
    setShowAddForm(false);
    setFormData({
      student_id: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      grade: "",
      classroom_id: "",
      gender: "male" as const,
      birth_date: "",
      address: "",
      parent_name: "",
      parent_phone: "",
      parent_email: "",
      status: "active" as const
    });
    setLoadingAction(false);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      student_id: student.student_id,
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      phone: student.phone,
      grade: student.grade,
      classroom_id: student.classroom_id.toString(),
      gender: student.gender,
      birth_date: student.birth_date,
      address: student.address,
      parent_name: student.parent_name,
      parent_phone: student.parent_phone,
      parent_email: student.parent_email,
      status: student.status
    });
    setShowAddForm(true);
  };

  const handleUpdateStudent = () => {
    if (!editingStudent) return;
    
    setLoadingAction(true);
    
    const updatedStudents = students.map(s => 
      s.id === editingStudent.id 
        ? {
            ...s,
            student_id: formData.student_id,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            grade: formData.grade,
            classroom_id: parseInt(formData.classroom_id),
            classroom_name: classrooms.find(c => c.id === parseInt(formData.classroom_id))?.name || "",
            gender: formData.gender,
            birth_date: formData.birth_date,
            address: formData.address,
            parent_name: formData.parent_name,
            parent_phone: formData.parent_phone,
            parent_email: formData.parent_email,
            status: formData.status,
            updated_at: new Date().toISOString()
          }
        : s
    );
    
    setStudents(updatedStudents);
    setShowAddForm(false);
    setEditingStudent(null);
    setLoadingAction(false);
  };

  const handleDeleteStudent = (id: number) => {
    if (confirm("คุณต้องการลบนักเรียนนี้ใช่หรือไม่?")) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "inactive": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "graduated": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "suspended": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "กำลังศึกษา";
      case "inactive": return "ไม่กำลังศึกษา";
      case "graduated": return "จบการศึกษา";
      case "suspended": return "ระงับการเรียน";
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
      title="จัดการนักเรียน"
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
            <h1 className="text-3xl font-bold text-white mb-2">จัดการนักเรียน</h1>
            <p className="text-slate-400">จัดการข้อมูลนักเรียนในโรงเรียน</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
          >
            <Plus className="w-5 h-5" />
            <span>เพิ่มนักเรียน</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหารหัส, ชื่อ, อีเมล..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">ทุกระดับชั้น</option>
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
          <select
            value={filterClassroom}
            onChange={(e) => setFilterClassroom(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">ทุกห้องเรียน</option>
            {classrooms.map(classroom => (
              <option key={classroom.id} value={classroom.name}>{classroom.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">ทุกสถานะ</option>
            <option value="active">กำลังศึกษา</option>
            <option value="inactive">ไม่กำลังศึกษา</option>
            <option value="graduated">จบการศึกษา</option>
            <option value="suspended">ระงับการเรียน</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>รีเฟรช</span>
          </button>
        </div>

        {/* Student Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.length === 0 ? (
            <GlassCard>
              <div className="text-center py-12 text-slate-400">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl mb-2">ไม่พบนักเรียน</p>
                <p>ลองปรับเปลี่ยนเงื่อนไขการค้นหา</p>
              </div>
            </GlassCard>
          ) : (
            filteredStudents.map((student) => (
              <GlassCard key={student.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-medium text-white">{student.first_name} {student.last_name}</h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}>
                    {getStatusText(student.status)}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-300">
                    <AlertCircle className="w-4 h-4" />
                    <span>รหัส: {student.student_id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-4 h-4" />
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-4 h-4" />
                    <span>{student.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <GraduationCap className="w-4 h-4" />
                    <span>ชั้นเรียน: {student.grade}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users className="w-4 h-4" />
                    <span>ห้อง: {student.classroom_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4" />
                    <span>วันเกิด: {new Date(student.birth_date).toLocaleDateString('th-TH')}</span>
                  </div>
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
              setEditingStudent(null);
              setFormData({
                student_id: "",
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                grade: "",
                classroom_id: "",
                gender: "male" as const,
                birth_date: "",
                address: "",
                parent_name: "",
                parent_phone: "",
                parent_email: "",
                status: "active" as const
              });
            }}
            title={editingStudent ? "แก้ไขข้อมูลนักเรียน" : "เพิ่มนักเรียนใหม่"}
          >
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">รหัสนักเรียน *</label>
                  <input
                    type="text"
                    value={formData.student_id}
                    onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                    placeholder="6401012345"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">ชื่อ *</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    placeholder="นายสมใจ"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">นามสกุล *</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    placeholder="จิตรัญญู"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">อีเมล *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="student@school.com"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">เบอร์โทรศัพ *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="081-234-5678"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">ชั้นเรียน *</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">เลือกชั้นเรียน</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">ห้องเรียน *</label>
                  <select
                    value={formData.classroom_id}
                    onChange={(e) => setFormData({...formData, classroom_id: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">เลือกห้องเรียน</option>
                    {classrooms.map(classroom => (
                      <option key={classroom.id} value={classroom.id}>{classroom.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">เพศ *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value as 'male' | 'female'})}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="male">ชาย</option>
                    <option value="female">หญิง</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">วันเกิด *</label>
                <input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">ที่อยู่ *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="123 ถน. ถน. พระราษม เขต กรุงเทพ 10100"
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
              
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">ชื่อผู้ปกครอม *</label>
                  <input
                    type="text"
                    value={formData.parent_name}
                    onChange={(e) => setFormData({...formData, parent_name: e.target.value})}
                    placeholder="คุณสมศรี ใจดี"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">เบอร์โทรศัพผู้ปกครอม *</label>
                  <input
                    type="tel"
                    value={formData.parent_phone}
                    onChange={(e) => setFormData({...formData, parent_phone: e.target.value})}
                    placeholder="081-987-6543"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">อีเมลผู้ปกครอม *</label>
                <input
                  type="email"
                  value={formData.parent_email}
                  onChange={(e) => setFormData({...formData, parent_email: e.target.value})}
                  placeholder="parent@school.com"
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">สถานะ *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive' | 'graduated' | 'suspended'})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="active">กำลังศึกษา</option>
                  <option value="inactive">ไม่กำลังศึกษา</option>
                  <option value="graduated">จบการศึกษา</option>
                  <option value="suspended">ระงับการเรียน</option>
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
                  onClick={editingStudent ? handleUpdateStudent : handleAddStudent}
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
                      <span>{editingStudent ? "อัพเดท" : "บันทึก"}</span>
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
