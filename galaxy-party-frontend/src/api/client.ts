const API_BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  body?: unknown
  constructor(status: number, message: string, body?: unknown) {
    super(message)
    this.status = status
    this.body = body
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  body?: unknown
  skipAuthRefresh?: boolean
}

let refreshPromise: Promise<Response> | null = null

async function rawRequest(path: string, init: RequestInit): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers ?? {}),
    },
  })
}

async function refreshSession(): Promise<Response> {
  if (!refreshPromise) {
    refreshPromise = rawRequest('/auth/refresh', { method: 'POST' }).finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const init: RequestInit = {
    method: options.method ?? 'GET',
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  }

  let response = await rawRequest(path, init)

  if (response.status === 401 && !options.skipAuthRefresh && path !== '/auth/refresh' && path !== '/auth/login' && path !== '/auth/register') {
    const refresh = await refreshSession()
    if (refresh.ok) {
      response = await rawRequest(path, init)
    } else {
      throw new ApiError(401, 'Session expired')
    }
  }

  if (!response.ok) {
    let body: unknown
    try { body = await response.json() } catch { /* ignore */ }
    throw new ApiError(response.status, response.statusText, body)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}