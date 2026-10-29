/**
 * Stoodify API Client (Fetch-based HTTP Client)
 * Mendukung injeksi token otomatis, base URL dinamis, dan penanganan refresh token.
 */

const DEFAULT_LOCAL_API = 'http://localhost:8080/api';
const DEFAULT_PROD_API = 'https://stoodify.kradev.my.id/api';

function resolveBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // Default fallback langsung ke server Production
  return DEFAULT_PROD_API;
}

export const API_BASE_URL = resolveBaseUrl();

const TOKEN_KEY = 'stoodify_access_token';
const REFRESH_TOKEN_KEY = 'stoodify_refresh_token';

export const tokenStorage = {
  getAccessToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setTokens(access: string, refresh?: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, access);
      if (refresh) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      }
    } catch (e) {
      console.warn('Gagal menyimpan token ke localStorage', e);
    }
  },
  getRefreshToken(): string | null {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },
  clearTokens(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (e) {
      console.warn('Gagal menghapus token dari localStorage', e);
    }
  },
};

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data: T;
  meta?: any;
}

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = tokenStorage.getAccessToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized -> Refresh Token
  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshJson = await refreshRes.json();
          const newAccess = refreshJson.data?.access_token || refreshJson.access_token;
          const newRefresh = refreshJson.data?.refresh_token || refreshJson.refresh_token;
          if (newAccess) {
            tokenStorage.setTokens(newAccess, newRefresh);
            headers.set('Authorization', `Bearer ${newAccess}`);
            const retryRes = await fetch(url, { ...options, headers });
            const retryData = await retryRes.json();
            return retryData.data !== undefined ? retryData.data : retryData;
          }
        }
      } catch (err) {
        tokenStorage.clearTokens();
      }
    }
  }

  let jsonResult: any;
  try {
    jsonResult = await response.json();
  } catch {
    jsonResult = null;
  }

  if (!response.ok) {
    let errorMsg = jsonResult?.message || `Request failed with status ${response.status}`;
    if (jsonResult?.errors && typeof jsonResult.errors === 'object') {
      const details = Object.entries(jsonResult.errors)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      if (details) {
        errorMsg = `${errorMsg} (${details})`;
      }
    }
    throw new ApiError(errorMsg, response.status, jsonResult);
  }

  return jsonResult?.data !== undefined ? jsonResult.data : jsonResult;
}
