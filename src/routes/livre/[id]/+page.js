import { env } from '$env/dynamic/public';

export async function load({ params }) {
  const res = await fetch(`${env.PUBLIC_API_URL}/book/${params.id}`);
  const book = await res.json();

  return { book };
}   