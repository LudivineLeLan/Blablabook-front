import { browser } from '$app/environment';
import { user } from '../../../lib/stores/auth.js';
import { get } from 'svelte/store';

export async function load({ fetch }) {
  if (!browser) return { users: [] };

  const currentUser = get(user);
  const token = currentUser?.token || localStorage.getItem('token');

  if (!token) {
    console.log("Aucun token trouvé");
    return { books: [] };
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/books`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`Erreur API: ${res.status}`);
    }

    const books = await res.json();
    return { books };
  } catch (error) {
    console.error(error);
    return { books: [] };
  }
}
