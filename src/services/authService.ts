import { apiRequest, tokenStorage } from "./apiClient";

export interface UserAuthData {
  id: string;
  name: string;
  email: string;
  grade?: string;
  school?: string;
  streakDays?: number;
  totalStudyHours?: number;
  completedTasksThisWeek?: number;
  isPro?: boolean;
}

export const authService = {
  isLoggedIn(): boolean {
    return !!tokenStorage.getAccessToken();
  },

  async login(email: string, password: string): Promise<UserAuthData> {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const accessToken = res.access_token || res.token;
    const refreshToken = res.refresh_token;
    if (accessToken) {
      tokenStorage.setTokens(accessToken, refreshToken);
    }

    const user = res.user || {};
    return {
      id: user.id ? String(user.id) : "",
      name: user.name || "Siswa",
      email: user.email || email,
      grade: user.grade || "SMA - Fase F",
      school: user.school || "Stoodify",
      streakDays: 0,
      totalStudyHours: 0,
      completedTasksThisWeek: 0,
      isPro: false,
    };
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    grade?: string;
    school?: string;
  }): Promise<UserAuthData> {
    await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword || data.password,
      }),
    });

    // Otomatis login setelah registrasi untuk mengambil access & refresh token
    const loggedInUser = await this.login(data.email, data.password);
    return {
      ...loggedInUser,
      name: data.name || loggedInUser.name,
      grade: data.grade || loggedInUser.grade,
      school: data.school || loggedInUser.school,
    };
  },

  async loginDemo(): Promise<UserAuthData> {
    const demoEmail = "naufal.pratama@student.id";
    const demoPassword = "password123";

    try {
      return await this.login(demoEmail, demoPassword);
    } catch {
      // Jika akun demo belum ada di DB backend, buat secara otomatis dengan confirm_password
      try {
        return await this.register({
          name: "Naufal Pratama",
          email: demoEmail,
          password: demoPassword,
          confirmPassword: demoPassword,
          grade: "SMA - Fase F",
          school: "Stoodify",
        });
      } catch (err) {
        console.error("Gagal inisialisasi akun demo:", err);
        throw err;
      }
    }
  },

  async getMe(): Promise<UserAuthData | null> {
    if (!tokenStorage.getAccessToken()) return null;
    try {
      const res = await apiRequest("/auth/me", { method: "GET" });
      return {
        id: res.id ? String(res.id) : "",
        name: res.name || "Siswa",
        email: res.email || "",
        grade: res.grade || "SMA - Fase F",
        school: res.school || "Stoodify",
        streakDays: 0,
        totalStudyHours: 0,
        completedTasksThisWeek: 0,
        isPro: false,
      };
    } catch {
      return null;
    }
  },

  logout(): void {
    tokenStorage.clearTokens();
  },
};
