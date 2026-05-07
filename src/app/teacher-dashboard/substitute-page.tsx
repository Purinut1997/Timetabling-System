"use client";

import { useState, useEffect } from "react";
import { ReactNode } from "react";
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
  XCircle,
  Plus,
  Filter,
  RefreshCw
} from "lucide-react";

// Type definitions
interface SubstituteRequest {
  id: number;
  requester_name: string;
  requester_email: string;
  subject: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  substitute_name?: string;
  reject_reason?: string;
}

interface Teacher {
  id: number;
  name: string;
  email: string;
  subjects: string[];
}

// Mock data for demonstration
const mockRequests: SubstituteRequest[] = [
  {
    id: 1,
    requester_name: "ครูสมศรี ใจดี",
    requester_email: "somsri@school.com",
    subject: "คณิตศาสตร์ ม.4/1",
    date: "2024-05-07",
    time: "09:00-10:00",
    reason: "ป่วยเฉียบพลัน",
    status: "pending",
    created_at: "2024-05-07T07:30:00Z"
  },
  {
    id: 2,
    requester_name: "ครูวิชัย รักงาน",
    requester_email: "wichai@school.com",
    subject: "ภาษาไทย ม.2/3",
    date: "2024-05-07",
    time: "10:00-11:00",
    reason: "ไปราชการ",
    status: "approved",
    substitute_name: "ครูมานี มีความสามารถ",
    created_at: "2024-05-07T06:15:00Z"
  },
  {
    id: 3,
    requester_name: "ครูนภา สอนดี",
    requester_email: "napa@school.com",
    subject: "วิทยาศาสตร์ ม.5/2",
    date: "2024-05-06",
    time: "13:00-14:00",
    reason: "ป่วย",
    status: "rejected",
    reject_reason: "ไม่มีครูที่สามารถสอนแทนในวิชานี้",
    created_at: "2024-05-06T12:00:00Z"
  }
];

const mockAvailableTeachers: Teacher[] = [
  { id: 1, name: "ครูมานี มีความสามารถ", email: "manee@school.com", subjects: ["คณิตศาสตร์", "ฟิสิกส์"] },
  { id: 2, name: "ครูสมชาย พร้อมใจ", email: "somchai@school.com", subjects: ["ภาษาไทย", "สังคมศึกษา"] },
  { id: 3, name: "ครูสามารถ สอนได้", email: "samarth@school.com", subjects: ["อังกฤษ", "วิทยาศาสตร์"] }
];

export default function SubstitutePage() {
  const { user, loading } = useRequireRole(["teacher", "school_admin", "super_admin"]);
  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [requests, setRequests] = useState(mockRequests);
  const [availableTeachers, setAvailableTeachers] = useState(mockAvailableTeachers);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SubstituteRequest | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    date: "",
    time: "",
    reason: ""
  });

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.requester_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction(true);
    
    // Simulate API call
    setTimeout(() => {
      const newRequest: SubstituteRequest = {
        id: requests.length + 1,
        requester_name: user?.full_name || "ครูผู้ขอ",
        requester_email: user?.email || "",
        ...formData,
        status: "pending",
        created_at: new Date().toISOString()
      };
      
      setRequests([newRequest, ...requests]);
      setFormData({ subject: "", date: "", time: "", reason: "" });
      setShowRequestForm(false);
      setLoadingAction(false);
    }, 1000);
  };

  const handleApprove = async () => {
    if (!selectedRequest || !selectedTeacher) return;
    
    setLoadingAction(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedRequests: SubstituteRequest[] = requests.map(req => 
        req.id === selectedRequest.id 
          ? { 
              ...req, 
              status: "approved" as const, 
              substitute_name: availableTeachers.find(t => t.id === parseInt(selectedTeacher))?.name 
            }
          : req
      );
      
      setRequests(updatedRequests);
      setShowApproveModal(false);
      setSelectedRequest(null);
      setSelectedTeacher("");
      setLoadingAction(false);
    }, 1000);
  };

  const handleReject = async (requestId: number, reason: string) => {
    setLoadingAction(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedRequests: SubstituteRequest[] = requests.map(req => 
        req.id === requestId 
          ? { ...req, status: "rejected" as const, reject_reason: reason }
          : req
      );
      
      setRequests(updatedRequests);
      setLoadingAction(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      case "approved": return "text-green-400 bg-green-400/20 border-green-400/30";
      case "rejected": return "text-red-400 bg-red-400/20 border-red-400/30";
      default: return "text-slate-400 bg-slate-400/20 border-slate-400/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "รออนุมัติ";
      case "approved": return "อนุมัติแล้ว";
      case "rejected": return "ปฏิเสธ";
      default: return status;
    }
  };

  if (loading) {
    return <main className="grid min-h-screen place-items-center text-white">กำลังตรวจสอบสิทธิ์...</main>;
  }

  return (
    <DashboardLayout
      title="ระบบจัดครูสอนแทน"
      role="Teacher Dashboard"
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
            <h1 className="text-3xl font-bold text-white mb-2">ระบบจัดครูสอนแทน</h1>
            <p className="text-slate-400">จัดการคำขอสอนแทนและครูที่ว่าง</p>
          </div>
          <button 
            onClick={() => setShowRequestForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
          >
            <Plus className="w-5 h-5" />
            <span>ขอสอนแทน</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "requests"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>คำขอสอนแทน</span>
          </button>
          <button
            onClick={() => setActiveTab("available")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === "available"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <User className="w-4 h-4" />
            <span>ครูที่ว่าง</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาคำขอ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">ทุกสถานะ</option>
            <option value="pending">รออนุมัติ</option>
            <option value="approved">อนุมัติแล้ว</option>
            <option value="rejected">ปฏิเสธ</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>รีเฟรช</span>
          </button>
        </div>

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <GlassCard>
                <div className="text-center py-12 text-slate-400">
                  <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl mb-2">ไม่พบคำขอสอนแทน</p>
                  <p>ลองปรับเปลี่ยนเงื่อนไขการค้นหาหรือสร้างคำขอใหม่</p>
                </div>
              </GlassCard>
            ) : (
              filteredRequests.map((request) => (
                <GlassCard key={request.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-cyan-400" />
                          <span className="font-medium text-white">{request.requester_name}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                      
                      <div className="grid gap-2 md:grid-cols-2 mb-3">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{request.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{request.time}</span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-slate-300 mb-1">วิชา:</p>
                        <p className="text-white">{request.subject}</p>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-slate-300 mb-1">เหตุผล:</p>
                        <p className="text-white">{request.reason}</p>
                      </div>
                      
                      {request.substitute_name && (
                        <div className="mb-3">
                          <p className="text-sm text-slate-300 mb-1">ครูสอนแทน:</p>
                          <p className="text-green-400">{request.substitute_name}</p>
                        </div>
                      )}
                      
                      {request.reject_reason && (
                        <div>
                          <p className="text-sm text-slate-300 mb-1">เหตุผลการปฏิเสธ:</p>
                          <p className="text-red-400">{request.reject_reason}</p>
                        </div>
                      )}
                    </div>
                    
                    {request.status === "pending" && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowApproveModal(true);
                          }}
                          disabled={loadingAction}
                          className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt("กรุณาระบุเหตุผลการปฏิเสธ:");
                            if (reason) {
                              handleReject(request.id, reason);
                            }
                          }}
                          disabled={loadingAction}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )}

        {/* Available Teachers Tab */}
        {activeTab === "available" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableTeachers.map((teacher) => (
              <GlassCard key={teacher.id}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="font-medium text-white mb-2">{teacher.name}</h3>
                  <p className="text-sm text-slate-400 mb-3">{teacher.email}</p>
                  <div className="mb-4">
                    <p className="text-sm text-slate-300 mb-2">วิชาที่สอนได้:</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {teacher.subjects.map((subject, index) => (
                        <span key={index} className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
                    ติดต่อ
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Request Form Modal */}
        <Modal
          isOpen={showRequestForm}
          onClose={() => setShowRequestForm(false)}
          title="ขอสอนแทน"
          size="md"
        >
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">วิชา *</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                placeholder="กรุณาระบุวิชาและชั้นเรียน"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">วันที่ *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">เวลา *</label>
                <input
                  type="text"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder="เช่น 09:00-10:00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">เหตุผล *</label>
              <textarea
                required
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                placeholder="กรุณาระบุเหตุผลการขอสอนแทน"
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loadingAction}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/25"
              >
                {loadingAction ? 'กำลังส่งคำขอ...' : 'ส่งคำขอ'}
              </button>
              <button
                type="button"
                onClick={() => setShowRequestForm(false)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all duration-200"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </Modal>

        {/* Approve Modal */}
        <Modal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          title="อนุมัติคำขอสอนแทน"
          size="md"
        >
          <div className="space-y-4">
            {selectedRequest && (
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <h4 className="font-medium text-white mb-2">รายละเอียดคำขอ</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-slate-400">ผู้ขอ:</span> <span className="text-white">{selectedRequest.requester_name}</span></p>
                  <p><span className="text-slate-400">วิชา:</span> <span className="text-white">{selectedRequest.subject}</span></p>
                  <p><span className="text-slate-400">วันที่:</span> <span className="text-white">{selectedRequest.date}</span></p>
                  <p><span className="text-slate-400">เวลา:</span> <span className="text-white">{selectedRequest.time}</span></p>
                  <p><span className="text-slate-400">เหตุผล:</span> <span className="text-white">{selectedRequest.reason}</span></p>
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">เลือกครูสอนแทน *</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              >
                <option value="">กรุณาเลือกครูสอนแทน</option>
                {availableTeachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.subjects.join(", ")}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleApprove}
                disabled={loadingAction || !selectedTeacher}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/25"
              >
                {loadingAction ? 'กำลังอนุมัติ...' : 'อนุมัติคำขอ'}
              </button>
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all duration-200"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
