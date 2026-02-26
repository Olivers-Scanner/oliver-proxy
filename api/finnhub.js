export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  
  const { symbol, type } = req.query
  const KEY = process.env.FINNHUB_KEY
  const now = Math.floor(Date.now()/1000)
  const from = now - 30*86400

  let url = ''
  if (type === 'forex') {
    url = `https://finnhub.io/api/v1/forex/candle?symbol=${symbol}&resolution=D&from=${from}&to=${now}&token=${KEY}`
  } else if (type === 'crypto') {
    url = `https://finnhub.io/api/v1/crypto/candle?symbol=${symbol}&resolution=D&from=${from}&to=${now}&token=${KEY}`
  } else {
    url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${now}&token=${KEY}`
  }

  try {
    const r = await fetch(url)
    const data = await r.json()
    res.status(200).json(data)
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
