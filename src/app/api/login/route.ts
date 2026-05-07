import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Mock users for local development
const MOCK_USERS = [
  {
    id: 1,
    full_name: "Super Admin",
    email: "admin@gmail.com",
    role: "super_admin",
    status: "active",
    school_id: null,
    password_hash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: "admin"
  },
  {
    id: 2,
    full_name: "ผู้ดูแลโรงเรียนบ้านโคกสูง",
    email: "schooladmin@gmail.com",
    role: "school_admin",
    status: "active",
    school_id: 1,
    password_hash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: "schooladmin123"
  },
  {
    id: 3,
    full_name: "ครูสมศรี ใจดี",
    email: "teacher@gmail.com",
    role: "teacher",
    status: "active",
    school_id: 1,
    password_hash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: "teacher123"
  },
];

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email/username and password are required" },
        { status: 400 }
      );
    }

    const identity = String(email).trim().toLowerCase();

    // Find user in mock data
    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === identity);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (user.status !== "active") {
      return NextResponse.json(
        { error: "Account is disabled" },
        { status: 403 }
      );
    }

    // Check password - for demo, accept any password with bcrypt hash
    const passOk = await bcrypt.compare(password, user.password_hash);
    
    // Fallback for demo: accept exact password match
    const isDemoPassword = 
      (email === "admin@gmail.com" && password === "admin") ||
      (email === "schooladmin@gmail.com" && password === "schooladmin123") ||
      (email === "teacher@gmail.com" && password === "teacher123");

    if (!passOk && !isDemoPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role, school_id: user.school_id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        school_id: user.school_id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed", detail: String(error) },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
