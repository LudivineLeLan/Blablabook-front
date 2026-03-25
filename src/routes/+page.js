import { env } from '$env/dynamic/public';

export async function load() {
  const res = await fetch(`${env.PUBLIC_API_URL}/`);
  const book = await res.json();

  return { book };
}