export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  const { interval, symbol, apikey } = req.query;
  const apiKey = process.env.FMP_KEY || apikey;
  return res.status(200).json({
    debug: true,
    received_apikey: apikey,
    env_key: process.env.FMP_KEY ? `SET (${process.env.FMP_KEY.length} chars)` : 'NOT SET',
    final_key: apiKey,
    url: `https://financialmodelingprep.com/stable/historical-chart/${interval}?symbol=${symbol}&apikey=${apiKey}`
  });
}
