import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Mock schools data
let mockSchools = [
  {
    id: 1,
    name: "โรงเรียนบ้านโคกสูง",
    address: "123 หมู่ 4 ต.โคกสูง อ.เมือง จ.ขอนแก่น 40000",
    contact_email: "koksoong@school.edu",
    phone: "043-123-4567",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "โรงเรียนวัดใหม่",
    address: "456 ถ.สุขุมวิท กรุงเทพฯ 10110",
    contact_email: "watmai@school.edu",
    phone: "02-123-4567",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

let nextSchoolId = 3;

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-in-production";

// Verify Super Admin token
async function verifySuperAdmin(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: number; role: string };
    if (decoded.role !== "super_admin") {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

// GET - Get all schools
export async function GET(request: NextRequest) {
  const admin = await verifySuperAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin only" }, { status: 401 });
  }

  try {
    return NextResponse.json({ schools: mockSchools });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get schools", detail: String(error) }, { status: 500 });
  }
}

// POST - Create new school
export async function POST(request: NextRequest) {
  const admin = await verifySuperAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin only" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, address, contact_email, phone } = body;

    if (!name || !address || !contact_email) {
      return NextResponse.json(
        { error: "Name, address, and contact email are required" },
        { status: 400 }
      );
    }

    // Check for duplicate name
    if (mockSchools.find(s => s.name === name)) {
      return NextResponse.json(
        { error: "School name already exists" },
        { status: 409 }
      );
    }

    const newSchool = {
      id: nextSchoolId++,
      name,
      address,
      contact_email,
      phone: phone || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockSchools.push(newSchool);

    return NextResponse.json(
      { school: newSchool, message: "School created successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Create school error:", error);
    return NextResponse.json(
      { error: "Failed to create school", detail: String(error) },
      { status: 500 }
    );
  }
}

// PUT - Update school
export async function PUT(request: NextRequest) {
  const admin = await verifySuperAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin only" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, name, address, contact_email, phone } = body;

    if (!id || !name || !address || !contact_email) {
      return NextResponse.json(
        { error: "ID, name, address, and contact email are required" },
        { status: 400 }
      );
    }

    const schoolIndex = mockSchools.findIndex(s => s.id === Number(id));
    if (schoolIndex === -1) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    // Check for duplicate name (excluding current school)
    const duplicate = mockSchools.find(s => s.name === name && s.id !== Number(id));
    if (duplicate) {
      return NextResponse.json(
        { error: "School name already exists" },
        { status: 409 }
      );
    }

    mockSchools[schoolIndex] = {
      ...mockSchools[schoolIndex],
      name,
      address,
      contact_email,
      phone: phone || mockSchools[schoolIndex].phone,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      school: mockSchools[schoolIndex],
      message: "School updated successfully"
    });

  } catch (error) {
    console.error("Update school error:", error);
    return NextResponse.json(
      { error: "Failed to update school", detail: String(error) },
      { status: 500 }
    );
  }
}

// DELETE - Delete school
export async function DELETE(request: NextRequest) {
  const admin = await verifySuperAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin only" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || searchParams.get("schoolId");

    if (!id) {
      return NextResponse.json({ error: "School ID is required" }, { status: 400 });
    }

    const schoolIndex = mockSchools.findIndex(s => s.id === Number(id));
    if (schoolIndex === -1) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    // In a real app, check if school has users before deleting
    // For mock data, we'll allow deletion

    const deletedSchool = mockSchools[schoolIndex];
    mockSchools.splice(schoolIndex, 1);

    return NextResponse.json({
      message: "School deleted successfully",
      school: deletedSchool
    });

  } catch (error) {
    console.error("Delete school error:", error);
    return NextResponse.json(
      { error: "Failed to delete school", detail: String(error) },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
