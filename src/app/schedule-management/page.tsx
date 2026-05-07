"use client";

import { useState, useEffect } from "react";
import { DashboardLayout, GlassCard } from "@/components/ui";
import { Modal } from "@/components/modal";
import { logout, useRequireRole } from "@/lib/auth-client";
import { teacherNav } from "@/lib/mock-data";
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Plus,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  Save,
  X
} from "lucide-react";

// Type definitions
interface Schedule {
  id: number;
  teacher_id: number;
  teacher_name: string;
  school_id: number;
  day_of_week: number;
  period: number;
  subject_name: string;
  room_name: string;
  academic_year: string;
  semester: string;
  created_at: string;
  updated_at: string;
}

interface Teacher {
  id: number;
  name: string;
  email: string;
  subject_group: string;
}

interface Room {
  id: number;
  name: string;
  capacity: number;
  building: string;
  floor: string;
}

// Mock data for demonstration
const mockSchedules: Schedule[] = [
  {
    id: 1,
    teacher_id: 1,
    teacher_name: "ครูสมศรี ใจดี",
    school_id: 1,
    day_of_week: 1,
    period: 1,
    subject_name: "คณิตศาสตร์ ม.4/1",
    room_name: "ห้อง 301",
    academic_year: "2569",
    semester: "1",
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  },
  {
    id: 2,
    teacher_id: 2,
    teacher_name: "ครูวิชัย รักงาน",
    school_id: 1,
    day_of_week: 1,
    period: 2,
    subject_name: "ภาษาไทย ม.2/3",
    room_name: "ห้อง 302",
    academic_year: "2569",
    semester: "1",
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  },
  {
    id: 3,
    teacher_id: 3,
    teacher_name: "ครูนภา สอนดี",
    school_id: 1,
    day_of_week: 2,
    period: 1,
    subject_name: "วิทยาศาสตร์ ม.5/2",
    room_name: "ห้อง 401",
    academic_year: "2569",
    semester: "1",
    created_at: "2024-05-07T07:30:00Z",
    updated_at: "2024-05-07T07:30:00Z"
  }
];

const mockTeachers: Teacher[] = [
  { id: 1, name: "ครูสมศรี ใจดี", email: "somsri@school.com", subject_group: "คณิตศาสตร์" },
  { id: 2, name: "ครูวิชัย รักงาน", email: "wichai@school.com", subject_group: "ภาษาไทย" },
  { id: 3, name: "ครูนภา สอนดี", email: "napa@school.com", subject_group: "วิทยาศาสตร์" }
];

const mockRooms: Room[] = [
  { id: 1, name: "ห้อง 301", capacity: 40, building: "อาคาร 1", floor: "3" },
  { id: 2, name: "ห้อง 302", capacity: 35, building: "อาคาร 1", floor: "3" },
  { id: 3, name: "ห้อง 401", capacity: 45, building: "อาคาร 4", floor: "4" }
];

const dayNames = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];

export default function ScheduleManagement() {
  const { user, loading } = useRequireRole(["teacher", "school_admin", "super_admin"]);
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const [formData, setFormData] = useState({
    teacher_id: "",
    day_of_week: "1",
    period: "1",
    subject_name: "",
    room_name: "",
    academic_year: "2569",
    semester: "1"
  });

  useEffect(() => {
    // Load schedules from API
    // apiFetch("/schedules")
    //   .then((data) => setSchedules(data))
    //   .catch(() => {});
  }, []);

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.room_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeacher = !filterTeacher || schedule.teacher_name.includes(filterTeacher);
    const matchesSubject = !filterSubject || schedule.subject_name.includes(filterSubject);
    const matchesDay = schedule.day_of_week === selectedDay;
    const matchesPeriod = schedule.period === selectedPeriod;
    
    return matchesSearch && matchesTeacher && matchesSubject && matchesDay && matchesPeriod;
  });

  const handleAddSchedule = () => {
    setLoadingAction(true);
    
    const newSchedule: Schedule = {
      id: schedules.length + 1,
      teacher_id: parseInt(formData.teacher_id),
      teacher_name: teachers.find(t => t.id === parseInt(formData.teacher_id))?.name || "",
      school_id: 1,
      day_of_week: parseInt(formData.day_of_week),
      period: parseInt(formData.period),
      subject_name: formData.subject_name,
      room_name: formData.room_name,
      academic_year: formData.academic_year,
      semester: formData.semester,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setSchedules([...schedules, newSchedule]);
    setShowAddForm(false);
    setFormData({
      teacher_id: "",
      day_of_week: "1",
      period: "1",
      subject_name: "",
      room_name: "",
      academic_year: "2569",
      semester: "1"
    });
    setLoadingAction(false);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      teacher_id: schedule.teacher_id.toString(),
      day_of_week: schedule.day_of_week.toString(),
      period: schedule.period.toString(),
      subject_name: schedule.subject_name,
      room_name: schedule.room_name,
      academic_year: schedule.academic_year,
      semester: schedule.semester
    });
    setShowAddForm(true);
  };

  const handleUpdateSchedule = () => {
    if (!editingSchedule) return;
    
    setLoadingAction(true);
    
    const updatedSchedules = schedules.map(s => 
      s.id === editingSchedule.id 
        ? {
            ...s,
            teacher_id: parseInt(formData.teacher_id),
            teacher_name: teachers.find(t => t.id === parseInt(formData.teacher_id))?.name || "",
            day_of_week: parseInt(formData.day_of_week),
            period: parseInt(formData.period),
            subject_name: formData.subject_name,
            room_name: formData.room_name,
            academic_year: formData.academic_year,
            semester: formData.semester,
            updated_at: new Date().toISOString()
          }
        : s
    );
    
    setSchedules(updatedSchedules);
    setShowAddForm(false);
    setEditingSchedule(null);
    setLoadingAction(false);
  };

  const handleDeleteSchedule = (id: number) => {
    if (confirm("คุณต้องการลบตารางสอนนี้ใช่หรือไม่?")) {
      setSchedules(schedules.filter(s => s.id !== id));
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
      title="จัดการตารางสอนแบบละเอียด"
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
            <h1 className="text-3xl font-bold text-white mb-2">จัดการตารางสอนแบบละเอียด</h1>
            <p className="text-slate-400">จัดการตารางสอนรายวันและรายคาบ</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
          >
            <Plus className="w-5 h-5" />
            <span>เพิ่มตารางสอน</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">วัน</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            >
              {dayNames.map((day, index) => (
                <option key={index + 1} value={index + 1}>{day}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">คาบที่</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            >
              {Array.from({length: 9}, (_, i) => i + 1).map(period => (
                <option key={period} value={period}>คาบที่ {period}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">ครูผู้สอน</label>
            <select
              value={filterTeacher}
              onChange={(e) => setFilterTeacher(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="">ทุกคน</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">วิชา</label>
            <input
              type="text"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              placeholder="ค้นหาวิชา..."
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">ค้นหา</label>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาตารางสอน..."
                className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid gap-4 lg:grid-cols-8">
          {/* Header Row */}
          <div className="font-medium text-cyan-400 text-center py-2">คาบ</div>
          {Array.from({length: 9}, (_, i) => i + 1).map(period => (
            <div key={period} className="font-medium text-cyan-400 text-center py-2 border border border-slate-700">
              คาบที่ {period}
            </div>
          ))}
          
          {/* Schedule Rows */}
          {filteredSchedules.map((schedule, index) => (
            <React.Fragment key={schedule.id}>
              <div className="text-slate-300 text-center py-3 border border border-slate-700">
                {dayNames[schedule.day_of_week - 1]}
              </div>
              {Array.from({length: 9}, (_, i) => i + 1).map(period => (
                <div key={period} className="border border border-slate-700 min-h-[60px]">
                  {schedule.period === period ? (
                    <div className="p-2">
                      <div className="text-xs text-slate-400">{schedule.subject_name}</div>
                      <div className="text-sm text-white font-medium">{schedule.teacher_name}</div>
                      <div className="text-xs text-cyan-400">{schedule.room_name}</div>
                      <div className="flex gap-1 mt-1">
                        <button
                          onClick={() => handleEditSchedule(schedule)}
                          className="p-1 text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="p-1 text-slate-500 hover:text-cyan-400"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showAddForm && (
          <Modal
            isOpen={showAddForm}
            onClose={() => {
              setShowAddForm(false);
              setEditingSchedule(null);
              setFormData({
                teacher_id: "",
                day_of_week: "1",
                period: "1",
                subject_name: "",
                room_name: "",
                academic_year: "2569",
                semester: "1"
              });
            }}
            title={editingSchedule ? "แก้ไขตารางสอน" : "เพิ่มตารางสอน"}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">ครูผู้สอน *</label>
                <select
                  value={formData.teacher_id}
                  onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">เลือกครูผู้สอน</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">วัน *</label>
                  <select
                    value={formData.day_of_week}
                    onChange={(e) => setFormData({...formData, day_of_week: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    {dayNames.map((day, index) => (
                      <option key={index + 1} value={index + 1}>{day}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">คาบที่ *</label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({...formData, period: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    {Array.from({length: 9}, (_, i) => i + 1).map(period => (
                      <option key={period} value={period}>คาบที่ {period}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">วิชา *</label>
                <input
                  type="text"
                  value={formData.subject_name}
                  onChange={(e) => setFormData({...formData, subject_name: e.target.value})}
                  placeholder="กรอกชื่อวิชาและชั้นเรียน"
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">ห้อง *</label>
                <select
                  value={formData.room_name}
                  onChange={(e) => setFormData({...formData, room_name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">เลือกห้อง</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.name}>{room.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid gap-4 grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">ปีการศึกษา *</label>
                  <input
                    type="text"
                    value={formData.academic_year}
                    onChange={(e) => setFormData({...formData, academic_year: e.target.value})}
                    placeholder="2569"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">ภาคเรียน *</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="1">ภาคเรียนที่ 1</option>
                    <option value="2">ภาคเรียนที่ 2</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={editingSchedule ? handleUpdateSchedule : handleAddSchedule}
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
                      <span>{editingSchedule ? "อัพเดท" : "บันทึก"}</span>
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
