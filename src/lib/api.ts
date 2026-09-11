import { auth } from '@/lib/firebase';

export const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');

export async function apiRequest(path: string, options: RequestInit = {}) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('You must be logged in.');
  }

  const token = await user.getIdToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status}) at ${path}.`);
  }
  return data;
}
