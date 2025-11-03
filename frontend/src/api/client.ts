import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_BACKEND_URL || '/api';

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  return headers;
}

export async function get<T>(endpoint: string): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}${endpoint}`, { headers });
  if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return response.json();
}

export async function post<T>(endpoint: string, body: unknown): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Failed to post to ${endpoint}`);
  return response.json();
}

export async function patch<T>(endpoint: string): Promise<T> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'PATCH',
    headers,
  });
  if (!response.ok) throw new Error(`Failed to patch ${endpoint}`);
  return response.json();
}
