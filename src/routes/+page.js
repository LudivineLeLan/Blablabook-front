export async function load() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/`);

  if (!res.ok) {
    console.error('Erreur API home page:', res.status);
    return { book: [] }; // fallback si API KO
  }

  const data = await res.json();

  // Vérifie que data est un tableau, sinon fallback sur tableau vide
  const book = Array.isArray(data) ? data : [];

  return { book };
}
