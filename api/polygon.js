export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { symbol, multiplier, timespan, from, to, apikey } = req.query;

  if (!symbol || !multiplier || !timespan || !from || !to) {
    return res.status(400).json({ error: 'Missing required params: symbol, multiplier, timespan, from, to' });
  }

  const key = process.env.POLYGON_KEY || apikey;
  if (!key) return res.status(401).json({ error: 'No Polygon/Massive API key' });

  try {
    // api.polygon.io and api.massive.com are identical — use polygon.io (stable)
    const url = `https://api.polygon.io/v2/aggs/ticker/${encodeURIComponent(symbol)}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&sort=asc&limit=50000&apiKey=${key}`;
    const response = await fetch(url);
    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({ error: `Polygon API error ${response.status}`, raw: text.slice(0, 300) });
    }

    const data = JSON.parse(text);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy fetch failed', detail: err.message });
  }
}
