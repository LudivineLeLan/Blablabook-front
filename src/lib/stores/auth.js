import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

export const user = writable(null);


export async function loadUserFromToken() {
  if (!browser) return; 

  const token = localStorage.getItem('token');

  if (!token) {
    user.set(null); 
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      const userData = await res.json();
      user.set(userData);
    } else { 
      user.set(null);
      localStorage.removeItem('token');
    }
  } catch { 
    user.set(null);
    localStorage.removeItem('token');
  }
}


export function logout() {
  user.set(null);
  localStorage.removeItem('token');

  if (browser) {
    import('./booklistStore.js').then(({ clearBooklistStatus }) => {
      clearBooklistStatus();
    });

    if (window.location.pathname !== '/') {
      goto('/');
    }
  }
}