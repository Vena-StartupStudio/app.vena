import { env } from "./env"

interface EdgeRequestInit {
  method?: string
  body?: unknown
  token?: string | null
  headers?: Record<string, string>
}

export async function callEdge<T>(path: string, init: EdgeRequestInit = {}): Promise<T> {
  if (!env.edgeBaseUrl) {
    throw new Error('VITE_EDGE_BASE_URL is not configured')
  }

  const url = `${env.edgeBaseUrl.replace(/\/$/, '')}${path}`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...init.headers
  }

  if (init.token) {
    headers.authorization = `Bearer ${init.token}`
  }

  const response = await fetch(url, {
    method: init.method ?? 'POST',
    headers,
    body: init.body ? JSON.stringify(init.body) : undefined
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    const errorMessage = errorBody?.error ?? `Edge request failed: ${response.status}`
    const error = new Error(errorMessage)
    ;(error as Error & { status?: number; details?: unknown }).status = response.status
    ;(error as Error & { status?: number; details?: unknown }).details = errorBody?.details
    throw error
  }

  return response.json() as Promise<T>
}
