"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export type UserRole = "teacher" | "school_admin" | "super_admin";
export type SessionUser = {
  id: number;
  full_name: string;
  email: string;
  role: UserRole;
  school_id: number | null;
};

export function getAuthToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("tt_token") || "";
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("tt_token");
  localStorage.removeItem("tt_role");
  localStorage.removeItem("tt_user");
}

export function useRequireRole(roles: UserRole[]) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    apiFetch<{ user: SessionUser }>("profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!roles.includes(res.user.role)) {
          router.replace("/login");
          return;
        }
        setUser(res.user);
      })
      .catch(() => {
        logout();
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [roles, router]);

  return { user, loading };
}
