// Simple API client for the ElectraBid app
// Uses VITE_API_URL for the backend base URL and supports Authorization via JWT

export type LoginResponse = { token: string };

const BASE_URL = (import.meta as any)?.env?.VITE_API_URL || "";

function url(path: string) {
  if (!BASE_URL) {
    throw new Error("VITE_API_URL is not set. Configure it in your environment (Vercel/Local .env).");
  }
  return `${BASE_URL}${path}`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url(path), {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
    ...options,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const msg = data?.error || res.statusText || "Request failed";
    throw new Error(msg);
  }
  return data as T;
}

function authHeaders(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  register: (payload: { name?: string; email: string; password: string }) =>
    request<{ id: string; email: string }>(`/auth/register`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<LoginResponse>(`/auth/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Elections
  getElections: () => request<any[]>(`/elections`),

  createElection: (
    payload: {
      title: string;
      description?: string;
      start_time?: string | null;
      end_time?: string | null;
    },
    token: string
  ) =>
    request<{ id: string; title: string }>(`/elections`, {
      method: "POST",
      headers: { ...authHeaders(token) },
      body: JSON.stringify(payload),
    }),

  // Votes
  vote: (
    payload: { election_id: string; candidate_id: string },
    token: string
  ) =>
    request<{ voteId: string; receiptCode: string }>(`/votes`, {
      method: "POST",
      headers: { ...authHeaders(token) },
      body: JSON.stringify(payload),
    }),

  // Auctions
  getAuctions: () => request<any[]>(`/auctions`),

  placeBid: (auctionId: string, amount: number, token: string) =>
    request<{ bidId: string; auctionId: string; amount: number }>(`/auctions/${auctionId}/bids`, {
      method: "POST",
      headers: { ...authHeaders(token) },
      body: JSON.stringify({ amount }),
    }),
};
