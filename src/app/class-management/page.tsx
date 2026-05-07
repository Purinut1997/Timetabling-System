"use client";

import { useState, useEffect } from "react";
import { DashboardLayout, GlassCard } from "@/components/ui";
import { Modal } from "@/components/modal";
import { logout, useRequireRole } from "@/lib/auth-client";
import { teacherNav } from "@/lib/mock-data";
import { 
  Search, 
  Building, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Plus,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Save,
  MapPin,
  DoorOpen
} from "lucide-react";

// Type definitions
interface Classroom {
  id: number;
  name: string;
  room_number: string;
  building: string;
  floor: string;
  capacity: number;
  type: string;
  equipment: string[];
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  student_id: string;
  grade: string;
  classroom_id: number;
  status: 'active' | 'inactive' | 'graduated';
  created_at: string;
  updated_at: string;
}

// Mock data for demonstration
const mockClassrooms: Classroom[] = [
  {
    id: 1,
    name: "ห้อง 301",
    room_number: "301",
    building: "อาคาร 1",
    floor: "3",
    capacity: 40,
    type: "ห้องเรียนปกติว",
    equipment: ["โปรเจคเตอร์", "กระดานขาว", "แผ่นขาว"],
    status: "active",
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  },
  {
    id: 2,
    name: "ห้อง 302",
    room_number: "302",
    building: "อาคาร 1",
    floor: "3",
    capacity: 35,
    type: "ห้องเรียนปกติว",
    equipment: ["โปรเจคเตอร์", "กระดานขาว"],
    status: "active",
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  },
  {
    id: 3,
    name: "ห้องวิทยาศาสตร์",
    room_number: "401",
    building: "อาคาร 4",
    floor: "4",
    capacity: 30,
    type: "ห้องแล็บ",
    equipment: ["ไมโครสโคป", "กล้องจุลภาพ", "อุปกรณ์วิทยาศาสตร์"],
    status: "active",
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  },
  {
    id: 4,
    name: "ห้องคอมพิวเตอร์",
    room_number: "501",
    building: "อาคาร 5",
    floor: "5",
    capacity: 25,
    type: "ห้องคอมพิวเตอร์",
    equipment: ["คอมพิวเตอร์", "ไมค์โฟน", "ลำโพง"],
    status: "active",
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  }
];

const mockStudents: Student[] = [
  { 
    id: 1, 
    name: "นายสมใจ จิตรัญญู", 
    email: "somchai@student.com", 
    student_id: "6401012345", 
    grade: "ม.4/1", 
    classroom_id: 1,
    status: "active",
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  },
  { 
    id: 2, 
    name: "มานี มีความ", 
    email: "manee@student.com", 
    student_id: "6401012346", 
    grade: "ม.4/2", 
    classroom_id: 1,
    status: "active",
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  },
  { 
    id: 3, 
    name: "วิชัย รักการเรียน", 
    email: "wichai@student.com", 
    student_id: "6401012347", 
    grade: "ม.5/1", 
    classroom_id: 2,
    status: "active",
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  }
];

export default function ClassManagement() {
  const { user, loading } = useRequireRole(["teacher", "school_admin", "super_admin"]);
  const [activeTab, setActiveTab] = useState("classrooms");
  const [classrooms, setClassrooms] = useState<Classroom[]>(mockClassrooms);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBuilding, setFilterBuilding] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    room_number: "",
    building: "",
    floor: "",
    capacity: "",
    type: "",
    equipment: [] as string[],
    status: "active" as "active"
  });

  useEffect(() => {
    // Load data from API
    // apiFetch("/classrooms")
    //   .then((data) => setClassrooms(data))
    //   .catch(() => {});
    // apiFetch("/students")
    //   .then((data) => setStudents(data))
    //   .catch(() => {});
  }, []);

  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classroom.room_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classroom.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBuilding = !filterBuilding || classroom.building.includes(filterBuilding);
    const matchesType = !filterType || classroom.type.includes(filterType);
    const matchesStatus = !filterStatus || classroom.status === filterStatus;
    
    return matchesSearch && matchesBuilding && matchesType && matchesStatus;
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.grade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || student.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddClassroom = () => {
    setLoadingAction(true);
    
    const newClassroom: Classroom = {
      id: classrooms.length + 1,
      name: formData.name,
      room_number: formData.room_number,
      building: formData.building,
      floor: formData.floor,
      capacity: parseInt(formData.capacity),
      type: formData.type,
      equipment: formData.equipment,
      status: formData.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setClassrooms([...classrooms, newClassroom]);
    setShowAddForm(false);
    setFormData({
      name: "",
      room_number: "",
      building: "",
      floor: "",
      capacity: "",
      type: "",
      equipment: [] as string[],
      status: "active" as "active"
    });
    setLoadingAction(false);
  };

  const handleEditClassroom = (classroom: Classroom) => {
    setEditingClassroom(classroom);
    setFormData({
      name: classroom.name,
      room_number: classroom.room_number,
      building: classroom.building,
      floor: classroom.floor,
      capacity: classroom.capacity.toString(),
      type: classroom.type,
      equipment: classroom.equipment,
      status: classroom.status
    });
    setShowAddForm(true);
  };

  const handleUpdateClassroom = () => {
    if (!editingClassroom) return;
    
    setLoadingAction(true);
    
    const updatedClassrooms = classrooms.map(c => 
      c.id === editingClassroom.id 
        ? {
            ...c,
            name: formData.name,
            room_number: formData.room_number,
            building: formData.building,
            floor: formData.floor,
            capacity: parseInt(formData.capacity),
            type: formData.type,
            equipment: formData.equipment,
            status: formData.status,
            updated_at: new Date().toISOString()
          }
        : c
    );
    
    setClassrooms(updatedClassrooms);
    setShowAddForm(false);
    setEditingClassroom(null);
    setLoadingAction(false);
  };

  const handleDeleteClassroom = (id: number) => {
    if (confirm("คุณต้องการลบห้องเรียนนี้ใช่หรือไม่?")) {
      setClassrooms(classrooms.filter(c => c.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "inactive": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "maintenance": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "ใช้งาน";
      case "inactive": return "ไม่ใช้งาน";
      case "maintenance": return "ซ่อมแซม";
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
      title="จัดการห้องเรียน"
      role="Super Admin"
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
            <h1 className="text-3xl font-bold text-white mb-2">จัดการห้องเรียน</h1>
            <p className="text-slate-400">จัดการข้อมูลห้องเรียนและนักเรียนในระบบ</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
          >
            <Plus className="w-5 h-5" />
            <span>เพิ่มห้องเรียน</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("classrooms")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "classrooms"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>ห้องเรียน</span>
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "students"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>นักเรียน</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาห้องเรียนหรือนักเรียน..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
          <select
            value={filterBuilding}
            onChange={(e) => setFilterBuilding(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">ทุกอาคาร</option>
            <option value="อาคาร 1">อาคาร 1</option>
            <option value="อาคาร 4">อาคาร 4</option>
            <option value="อาคาร 5">อาคาร 5</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">ทุกประเภท</option>
            <option value="ห้องเรียนปกติว">ห้องเรียนปกติว</option>
            <option value="ห้องแล็บ">ห้องแล็บ</option>
            <option value="ห้องคอมพิวเตอร์">ห้องคอมพิวเตอร์</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">ทุกสถานะ</option>
            <option value="active">ใช้งาน</option>
            <option value="inactive">ไม่ใช้งาน</option>
            <option value="maintenance">ซ่อมแซม</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>รีเฟรช</span>
          </button>
        </div>

        {/* Classrooms Tab */}
        {activeTab === "classrooms" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClassrooms.length === 0 ? (
              <GlassCard>
                <div className="text-center py-12 text-slate-400">
                  <Building className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl mb-2">ไม่พบห้องเรียน</p>
                  <p>ลองปรับเปลี่ยนเงื่อนไขการค้นหา</p>
                </div>
              </GlassCard>
            ) : (
              filteredClassrooms.map((classroom) => (
                <GlassCard key={classroom.id}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-medium text-white">{classroom.name}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(classroom.status)}`}>
                      {getStatusText(classroom.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4" />
                      <span>{classroom.building} - ชั้น {classroom.floor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Users className="w-4 h-4" />
                      <span>ความจุ {classroom.capacity} คน</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <DoorOpen className="w-4 h-4" />
                      <span>ประเภท: {classroom.type}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-slate-300 mb-1">อุปกรณ์:</p>
                    <div className="flex flex-wrap gap-1">
                      {classroom.equipment.map((item, index) => (
                        <span key={index} className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClassroom(classroom)}
                      className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClassroom(classroom.id)}
                      className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="space-y-4">
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
                      <h3 className="font-medium text-white">{student.name}</h3>
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
                      <Building className="w-4 h-4" />
                      <span>ชั้นเรียน: {student.grade}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <AlertCircle className="w-4 h-4" />
                      <span>{student.email}</span>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {showAddForm && activeTab === "classrooms" && (
          <Modal
            isOpen={showAddForm}
            onClose={() => {
              setShowAddForm(false);
              setEditingClassroom(null);
              setFormData({
                name: "",
                room_number: "",
                building: "",
                floor: "",
                capacity: "",
                type: "",
                equipment: [] as string[],
                status: "active" as "active"
              });
            }}
            title={editingClassroom ? "แก้ไขข้อมูลห้องเรียน" : "เพิ่มห้องเรียนใหม่"}
          >
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">ชื่อห้อง *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="เช่น ห้อง 301"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">เลขห้อง *</label>
                  <input
                    type="text"
                    value={formData.room_number}
                    onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                    placeholder="301"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">อาคาร *</label>
                  <select
                    value={formData.building}
                    onChange={(e) => setFormData({...formData, building: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">เลือกอาคาร</option>
                    <option value="อาคาร 1">อาคาร 1</option>
                    <option value="อาคาร 2">อาคาร 2</option>
                    <option value="อาคาร 3">อาคาร 3</option>
                    <option value="อาคาร 4">อาคาร 4</option>
                    <option value="อาคาร 5">อาคาร 5</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">ชั้น *</label>
                  <input
                    type="text"
                    value={formData.floor}
                    onChange={(e) => setFormData({...formData, floor: e.target.value})}
                    placeholder="3"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">ความจุ *</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    placeholder="40"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">ประเภท *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">เลือกประเภท</option>
                    <option value="ห้องเรียนปกติว">ห้องเรียนปกติว</option>
                    <option value="ห้องแล็บ">ห้องแล็บ</option>
                    <option value="ห้องคอมพิวเตอร์">ห้องคอมพิวเตอร์</option>
                    <option value="ห้องปฏิบัติ">ห้องปฏิบัติ</option>
                    <option value="ห้องดนตรี">ห้องดนตรี</option>
                  </select>
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
                  <option value="maintenance">ซ่อมแซม</option>
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
                  onClick={editingClassroom ? handleUpdateClassroom : handleAddClassroom}
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
                      <span>{editingClassroom ? "อัพเดท" : "บันทึก"}</span>
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
