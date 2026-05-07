import { apiFetch } from "./api";

// Helper function for API requests with authentication
async function apiRequest<T>(path: string, method: string = "GET", data?: any): Promise<T> {
  const token = localStorage.getItem("auth_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return apiFetch<T>(path, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });
}

// Schools Management API
export const schoolsAPI = {
  getAll: async () => {
    return apiRequest("/super-schools", "GET");
  },
  
  create: async (data: { name: string; address: string; contact_email: string }) => {
    return apiRequest("/super-schools", "POST", data);
  },
  
  update: async (data: { id: number; name: string; address: string; contact_email: string }) => {
    return apiRequest("/super-schools", "PUT", data);
  },
  
  delete: async (schoolId: number) => {
    return apiRequest(`/super-schools/${schoolId}`, "DELETE");
  }
};

// Users Management API
export const usersAPI = {
  getAll: async (filters?: { school_id?: number; role?: string; status?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
    }
    return apiRequest(`/super-users${params.toString() ? `?${params.toString()}` : ""}`, "GET");
  },
  
  create: async (data: { 
    full_name: string; 
    email: string; 
    password: string; 
    role: string; 
    school_id: number 
  }) => {
    return apiRequest("/super-users", "POST", data);
  },
  
  update: async (data: { 
    id: number; 
    full_name?: string; 
    email?: string; 
    role?: string; 
    status?: string; 
    school_id?: number 
  }) => {
    return apiRequest("/super-users", "PUT", data);
  },
  
  delete: async (userId: number) => {
    return apiRequest(`/super-users/${userId}`, "DELETE");
  },
  
  resetPassword: async (userId: number, newPassword: string) => {
    return apiRequest("/super-users/reset-password", "POST", { userId, newPassword });
  }
};

// Content Management API
export const contentAPI = {
  getAll: async () => {
    return apiRequest("/super-content", "GET");
  },
  
  update: async (key: string, value: string) => {
    return apiRequest("/super-content", "PUT", { key, value });
  },
  
  bulkUpdate: async (content: Record<string, string>) => {
    return apiRequest("/super-content", "POST", { content });
  }
};

// Reports API
export const reportsAPI = {
  getOverview: async () => {
    return apiRequest("/super-reports", "GET");
  },
  
  getMonthlyTrends: async () => {
    return apiRequest("/super-reports?type=monthly_trends", "GET");
  },
  
  getDailyActivity: async () => {
    return apiRequest("/super-reports?type=daily_activity", "GET");
  }
};

// System Settings API
export const settingsAPI = {
  get: async () => {
    return apiRequest("/super-settings", "GET");
  },
  
  update: async (settings: {
    periods: number;
    school_days: string[];
    academic_year: string;
    semester: string;
    period_duration?: number;
    start_time?: string;
    end_time?: string;
    break_time?: string;
    break_duration?: number;
  }) => {
    return apiRequest("/super-settings", "PUT", { settings });
  }
};
