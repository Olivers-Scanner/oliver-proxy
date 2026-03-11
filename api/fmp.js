export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { symbol, interval, apikey, endpoint } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol' });
  }

  const key = process.env.FMP_KEY || apikey;

  if (!key) {
    return res.status(401).json({ error: 'No API key provided' });
  }

  try {
    let url;

    if (endpoint === 'quote') {
      // Real-time quote — for price ticker (every 7 seconds)
      url = `https://financialmodelingprep.com/stable/quote?symbol=${symbol}&apikey=${key}`;
    } else {
      // Historical bars — for signal calculation
      if (!interval) return res.status(400).json({ error: 'Missing interval' });
      url = `https://financialmodelingprep.com/stable/historical-chart/${interval}?symbol=${symbol}&apikey=${key}`;
    }

    const response = await fetch(url);
    const text = await response.text();

    if (text.includes('Restricted') || text.includes('upgrade') || text.includes('Invalid API')) {
      return res.status(403).json({ error: 'FMP API key restricted.', raw: text.slice(0, 200) });
    }

    const data = JSON.parse(text);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy fetch failed', detail: err.message });
  }
}
