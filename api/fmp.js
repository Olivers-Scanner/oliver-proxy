export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const { interval, symbol, apikey } = req.query

  if (!interval || !symbol || !apikey) {
    return res.status(400).json({ error: 'Missing params' })
  }

  try {
    const url = `https://financialmodelingprep.com/stable/historical-chart/${interval}/${symbol}?apikey=${apikey}`
    const response = await fetch(url)
    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=60')
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
