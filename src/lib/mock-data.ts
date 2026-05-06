export const publicContent = {
  homeAnnouncement:
    "เปิดใช้งาน Timetabling System รุ่นใหม่แล้ว รองรับการแจ้งขอสอนแทนแบบเรียลไทม์และทำงานได้เร็วขึ้นกว่าเดิม",
  contactInfo: "support@timetable.ai | 02-000-1234 | Bangkok, Thailand",
  privacyPolicy: "ข้อมูลผู้ใช้งานจะถูกเข้ารหัสและใช้เพื่อการจัดตารางเรียนเท่านั้น",
};

export const teacherNav = [
  { label: "ตารางสอนของฉัน", href: "/teacher-dashboard" },
  { label: "การสอนแทน", href: "/teacher-dashboard#substitute" },
  { label: "ขอสอนแทน", href: "/teacher-dashboard#request" },
  { label: "เปลี่ยนรหัสผ่าน", href: "/teacher-dashboard#password" },
];

export const adminNav = [
  { label: "จัดการครู", href: "/admin-dashboard" },
  { label: "จัดการสอนแทน", href: "/admin-dashboard#substitute" },
  { label: "ดูตารางครูทั้งหมด", href: "/admin-dashboard#schedules" },
];

export const superNav = [
  { label: "จัดการโรงเรียน", href: "/super-dashboard" },
  { label: "จัดการผู้ใช้ทั้งหมด", href: "/super-dashboard#users" },
  { label: "จัดการหน้าแรก", href: "/super-dashboard#content" },
  { label: "รายงานสถิติ", href: "/super-dashboard#reports" },
  { label: "ตั้งค่าระบบ", href: "/super-dashboard#settings" },
];
