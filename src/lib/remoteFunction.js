export const getSearchSuggestions = async (query, type, signal) => {
  if (!query) return [];

  const url = new URL(`${import.meta.env.VITE_API_URL}/search`);
  url.searchParams.set('q', query);
  if (type) url.searchParams.set('type', type);

  const res = await fetch(url, { signal });

  if (!res.ok) throw new Error('Recherche échouée');

  const data = await res.json();
  return data;
};
