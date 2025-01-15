const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080', 'http://localhost:5000', 'http://localhost:8000']

const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  } else {
    console.log(origin)
    res.status(403).json({ message: 'Acceso denegado.' })
  }

  next()
}

export default corsMiddleware
