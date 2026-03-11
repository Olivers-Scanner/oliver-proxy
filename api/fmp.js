export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { interval, symbol } = req.query;

  if (!interval || !symbol) {
    return res.status(400).json({ error: 'Missing interval or symbol' });
  }

  const apiKey = process.env.FMP_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'FMP_KEY not configured' });
  }

  // CORRECT: symbol is a query param, NOT a path segment
  // e.g. /stable/historical-chart/1hour?symbol=AAPL&apikey=KEY
  const url = `https://financialmodelingprep.com/stable/historical-chart/${interval}?symbol=${symbol}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
