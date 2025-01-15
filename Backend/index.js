import express from 'express'
import searchRoutes from './Routes/searchRoutes.js'
import corsMiddleware from './Middleware/cors.js'

// Set up Express app
const app = express()
app.use(express.json())
app.disable('x-powered-by')

const PORT = process.env.PORT || 3000

app.use(corsMiddleware)

app.use('/api', searchRoutes)
app.use('/', (req, res) => {
  res.header('Content-Type', 'text/html')
  res.status(200).send('<h1>Bienvenido a la API</h1>')
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
