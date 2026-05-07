import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      announcements: [
        {
          id: 1,
          title: "เปิดใช้งานระบบจัดตารางสอน v1.0",
          content: "ระบบพร้อมใช้งานแล้วสำหรับปีการศึกษา 2568",
          created_at: new Date().toISOString(),
        },
      ],
      stats: {
        totalSchools: 1,
        totalTeachers: 3,
        totalStudents: 150,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get content", detail: String(error) },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
