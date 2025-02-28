import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './Config/mongodb.js'
import authRouter from './Routes/authRouters.js'
import userRouter from './Routes/userRouters.js'

const app = express()
const port = process.env.PORT

// mongodb configuration
connectDB()

const allowedOrigins = ['http://localhost:5173', 'https://mern-auth-weld.vercel.app']

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: allowedOrigins, credentials: true }))

// rest APIs
app.get('/', (req, res) => {
    res.send('API working fine ...')
})
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(port, () => {
    console.log(`Server listening on port : ${port}`)
})