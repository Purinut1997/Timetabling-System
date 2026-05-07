import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Mock users storage (in-memory for development)
let mockUsers: Array<{
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  role: string;
  status: string;
  school_id: number;
}> = [
  {
    id: 1,
    full_name: "Super Admin",
    email: "admin@gmail.com",
    password_hash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    role: "super_admin",
    status: "active",
    school_id: 0
  }
];

let nextUserId = 2;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, confirmPassword, schoolId } = body;

    // Validate required fields
    if (!fullName || !email || !password || !confirmPassword || !schoolId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Password confirmation does not match" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Check if email already exists
    const existing = mockUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hash = await bcrypt.hash(password, 12);

    // Create user
    const newUser = {
      id: nextUserId++,
      full_name: fullName,
      email: normalizedEmail,
      password_hash: hash,
      role: "teacher",
      status: "active",
      school_id: Number(schoolId)
    };

    mockUsers.push(newUser);

    return NextResponse.json({
      message: "Register success",
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        school_id: newUser.school_id
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Register failed", detail: String(error) },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
