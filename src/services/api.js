export async function generateReadingAPI(text) {
  const response = await fetch(import.meta.env.VITE_API_URL + '/api/generate-reading', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate lesson');
  }
  return data;
}
