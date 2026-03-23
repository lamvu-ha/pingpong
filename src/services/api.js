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

export async function fetchWordData(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) throw new Error('Word not found');
    return await response.json();
  } catch (e) {
    return null;
  }
}
