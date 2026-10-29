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

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!res.ok) {
        tokenStorage.clearTokens();
        return null;
      }

      const json = await res.json();
      const newAccess = json.data?.access_token || json.access_token;
      const newRefresh = json.data?.refresh_token || json.refresh_token;

      if (newAccess) {
        tokenStorage.setTokens(newAccess, newRefresh);
        return newAccess;
      }
      return null;
    } catch {
      tokenStorage.clearTokens();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const collectionRoutes = [
    '/subjects',
    '/schedules',
    '/tasks',
    '/activities',
    '/notifications',
    '/study-sessions',
  ];
  if (collectionRoutes.includes(normalizedEndpoint)) {
    normalizedEndpoint = `${normalizedEndpoint}/`;
  }
  const url = `${API_BASE_URL}${normalizedEndpoint}`;
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

  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      headers.set('Authorization', `Bearer ${newAccess}`);
      const retryRes = await fetch(url, { ...options, headers });
      const retryData = await retryRes.json();
      return retryData.data !== undefined ? retryData.data : retryData;
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
