// api/fmp.js — Vercel serverless proxy for FMP v2
// Handles stocks, crypto, forex, indices with correct endpoints

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { interval, symbol, apikey } = req.query
  if (!interval || !symbol || !apikey) {
    return res.status(400).json({ error: 'Missing params' })
  }

  // Try multiple endpoint formats — FMP uses different paths per asset type
  const endpoints = [
    `https://financialmodelingprep.com/stable/historical-chart/${interval}/${symbol}?apikey=${apikey}`,
    `https://financialmodelingprep.com/api/v3/historical-chart/${interval}/${symbol}?apikey=${apikey}`,
  ]

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'OliverScanner/1.0' }
      })
      const data = await response.json()
      // Return first non-empty array result
      if (Array.isArray(data) && data.length > 0) {
        res.setHeader('Cache-Control', 's-maxage=60')
        return res.status(200).json(data)
      }
      // If it's an error object, continue to next endpoint
      if (data && data['Error Message']) continue
    } catch (err) {
      continue
    }
  }

  // Nothing worked — return empty array
  return res.status(200).json([])
}
