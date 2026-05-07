import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Mock users storage
let mockUsers = [
  {
    id: 1,
    full_name: "Super Admin",
    email: "admin@gmail.com",
    password_hash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "super_admin",
    status: "active",
    school_id: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    full_name: "ผู้ดูแลโรงเรียนบ้านโคกสูง",
    email: "schooladmin@gmail.com",
    password_hash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "school_admin",
    status: "active",
    school_id: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    full_name: "ครูสมศรี ใจดี",
    email: "teacher@gmail.com",
    password_hash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "teacher",
    status: "active",
    school_id: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

let nextUserId = 4;

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

// GET - List all users
export async function GET(request: NextRequest) {
  const admin = await verifySuperAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin only" }, { status: 401 });
  }

  try {
    const users = mockUsers.map(u => ({
      id: u.id,
      full_name: u.full_name,
      email: u.email,
      role: u.role,
      status: u.status,
      school_id: u.school_id,
      created_at: u.created_at,
      updated_at: u.updated_at
    }));

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get users", detail: String(error) }, { status: 500 });
  }
}

// POST - Create new user with specific role
export async function POST(request: NextRequest) {
  const admin = await verifySuperAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin only" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { fullName, email, password, role, schoolId, status = "active" } = body;

    // Validate
    if (!fullName || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields: fullName, email, password, role" }, { status: 400 });
    }

    // Validate role
    const validRoles = ["teacher", "school_admin", "super_admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: `Invalid role. Must be one of: ${validRoles.join(", ")}` }, { status: 400 });
    }

    // School admin must have school_id
    if (role === "school_admin" && !schoolId) {
      return NextResponse.json({ error: "School Admin must have school_id" }, { status: 400 });
    }

    // Teacher should have school_id
    if (role === "teacher" && !schoolId) {
      return NextResponse.json({ error: "Teacher should have school_id" }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Check duplicate email
    if (mockUsers.find(u => u.email.toLowerCase() === normalizedEmail)) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 12);

    const newUser = {
      id: nextUserId++,
      full_name: fullName,
      email: normalizedEmail,
      password_hash: hash,
      role,
      status,
      school_id: schoolId ? Number(schoolId) : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockUsers.push(newUser);

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        school_id: newUser.school_id,
        created_at: newUser.created_at
      }
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to create user", detail: String(error) }, { status: 500 });
  }
}

// PUT - Update user role/status
export async function PUT(request: NextRequest) {
  const admin = await verifySuperAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin only" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, fullName, email, role, schoolId, status } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const userIndex = mockUsers.findIndex(u => u.id === Number(id));
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate role if provided
    if (role) {
      const validRoles = ["teacher", "school_admin", "super_admin"];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: `Invalid role. Must be one of: ${validRoles.join(", ")}` }, { status: 400 });
      }
    }

    // Update user
    const user = mockUsers[userIndex];
    if (fullName) user.full_name = fullName;
    if (email) user.email = String(email).trim().toLowerCase();
    if (role) user.role = role;
    if (schoolId !== undefined) user.school_id = schoolId ? Number(schoolId) : null;
    if (status) user.status = status;
    user.updated_at = new Date().toISOString();

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status,
        school_id: user.school_id,
        updated_at: user.updated_at
      }
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to update user", detail: String(error) }, { status: 500 });
  }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
  const admin = await verifySuperAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized - Super Admin only" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const userIndex = mockUsers.findIndex(u => u.id === Number(id));
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deleting self
    if (Number(id) === admin.sub) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    mockUsers.splice(userIndex, 1);

    return NextResponse.json({ message: "User deleted successfully" });

  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user", detail: String(error) }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
