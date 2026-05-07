import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const MOCK_USERS = [
  {
    id: 1,
    full_name: "Super Admin",
    email: "admin@gmail.com",
    role: "super_admin",
    status: "active",
    school_id: null,
  },
  {
    id: 2,
    full_name: "ผู้ดูแลโรงเรียนบ้านโคกสูง",
    email: "schooladmin@gmail.com",
    role: "school_admin",
    status: "active",
    school_id: 1,
  },
  {
    id: 3,
    full_name: "ครูสมศรี ใจดี",
    email: "teacher@gmail.com",
    role: "teacher",
    status: "active",
    school_id: 1,
  },
];

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-in-production";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { sub: number; role: string; school_id: number | null };
      const user = MOCK_USERS.find((u) => u.id === decoded.sub);
      
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          school_id: user.school_id,
        },
      });
    } catch (jwtError) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json(
      { error: "Failed to get profile", detail: String(error) },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({ ok: true }, { status: 200 });
}
