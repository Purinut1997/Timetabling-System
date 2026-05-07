import { NextResponse } from "next/server";

// Mock schools for local development
const MOCK_SCHOOLS = [
  {
    id: 1,
    name: "โรงเรียนบ้านโคกสูง",
    address: "123 หมู่ 4 ต.โคกสูง อ.เมือง จ.ขอนแก่น 40000",
    phone: "043-123-4567",
    email: "koksoong@school.edu",
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "โรงเรียนวัดใหม่",
    address: "456 ถ.สุขุมวิท กรุงเทพฯ 10110",
    phone: "02-123-4567",
    email: "watmai@school.edu",
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

export async function GET() {
  try {
    return NextResponse.json({
      schools: MOCK_SCHOOLS.map(s => ({
        id: s.id,
        name: s.name,
        address: s.address,
        phone: s.phone,
        email: s.email,
        status: s.status
      }))
    });
  } catch (error) {
    console.error("Get schools error:", error);
    return NextResponse.json(
      { error: "Failed to get schools", detail: String(error) },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
