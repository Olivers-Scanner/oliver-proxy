export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { interval, symbol, apikey } = req.query;

  if (!interval || !symbol) {
    return res.status(400).json({ error: 'Missing interval or symbol' });
  }

  // Use server-side key if available, fall back to client-provided key
  const apiKey = process.env.FMP_KEY || apikey;

  if (!apiKey) {
    return res.status(500).json({ error: 'No API key available' });
  }

  const url = `https://financialmodelingprep.com/stable/historical-chart/${interval}?symbol=${symbol}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
