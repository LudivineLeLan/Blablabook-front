import { browser } from '$app/environment';
import { user } from '../../../lib/stores/auth.js';
import { get } from 'svelte/store';

export async function load({ fetch }) {
  if (!browser) return { users: [] }; // côté serveur on ne fait rien

  const currentUser = get(user);
  const token = currentUser?.token || localStorage.getItem('token');

  if (!token) {
    console.log("Aucun token trouvé");
    return { users: [] };
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`Erreur API: ${res.status}`);
    }

    const users = await res.json();
    return { users };
  } catch (error) {
    console.error(error);
    return { users: [] };
  }
}
