export async function load() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/`);
  const book = await res.json();

  return { book };
}