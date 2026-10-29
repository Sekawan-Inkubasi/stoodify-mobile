import { apiRequest, tokenStorage } from './apiClient';

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
    const res = await apiRequest('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const accessToken = res.access_token || res.token;
    const refreshToken = res.refresh_token;
    if (accessToken) {
      tokenStorage.setTokens(accessToken, refreshToken);
    }

    const user = res.user || {};
    return {
      id: user.id || 'usr-1',
      name: user.name || 'Siswa Stoodify',
      email: user.email || email,
      grade: user.grade || 'SMA Kelas 11 - Fase F',
      school: user.school || 'SMAN 1 Teladan',
      streakDays: 5,
      totalStudyHours: 14.5,
      completedTasksThisWeek: 8,
      isPro: false,
    };
  },

  async register(data: { name: string; email: string; password: string; grade?: string; school?: string }): Promise<UserAuthData> {
    const res = await apiRequest('/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    const accessToken = res.access_token || res.token;
    const refreshToken = res.refresh_token;
    if (accessToken) {
      tokenStorage.setTokens(accessToken, refreshToken);
    }

    const user = res.user || {};
    return {
      id: user.id || 'usr-new',
      name: user.name || data.name,
      email: user.email || data.email,
      grade: data.grade || 'SMA Kelas 11 - Fase F',
      school: data.school || 'SMAN 1 Teladan',
      streakDays: 1,
      totalStudyHours: 0,
      completedTasksThisWeek: 0,
      isPro: false,
    };
  },

  async loginDemo(): Promise<UserAuthData> {
    const demoEmail = 'naufal.pratama@student.id';
    const demoPassword = 'password123';

    try {
      return await this.login(demoEmail, demoPassword);
    } catch {
      // Jika akun demo belum ada di DB backend, buat secara otomatis
      try {
        await this.register({
          name: 'Naufal Pratama',
          email: demoEmail,
          password: demoPassword,
          grade: 'SMA Kelas 11 - Fase F',
          school: 'SMAN 1 Teladan',
        });
        return await this.login(demoEmail, demoPassword);
      } catch (err) {
        console.error('Gagal inisialisasi akun demo:', err);
        throw err;
      }
    }
  },

  async getMe(): Promise<UserAuthData | null> {
    if (!tokenStorage.getAccessToken()) return null;
    try {
      const res = await apiRequest('/v1/auth/me', { method: 'GET' });
      return {
        id: res.id || 'usr-me',
        name: res.name || 'Siswa Stoodify',
        email: res.email || '',
        grade: res.grade || 'SMA Kelas 11 - Fase F',
        school: res.school || 'SMAN 1 Teladan',
        streakDays: 5,
        totalStudyHours: 14.5,
        completedTasksThisWeek: 8,
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
