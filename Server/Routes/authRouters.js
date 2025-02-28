import express from 'express'
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../Controllers/authController.js'
import userAuth from '../Middleware/userAuth.js'

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.post('/sendVerifyOtp', userAuth, sendVerifyOtp)
authRouter.post('/verifyEmail', userAuth, verifyEmail)
authRouter.get('/isAuthenticated', userAuth, isAuthenticated)
authRouter.post('/sendResetOtp', sendResetOtp)
authRouter.post('/resetPassword', resetPassword)

export default authRouter