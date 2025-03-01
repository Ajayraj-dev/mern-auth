import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../Models/userModel.js'
import transporter from '../Config/nodemailer.js'
import { EMAIL_VERIFY_TEMPLATE, GREEETING_EMAIL_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../Config/emailTemplates.js'

// user register api
export const register = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Provide all details' })
    }

    try {
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new userModel({ name, email, password: hashedPassword })
        await user.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_DEV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Greetings from Ajayraj!",
            // text: `Welcome to my website. Your account has been created with this email id : ${email}`,
            html: GREEETING_EMAIL_TEMPLATE.replace("{{email}}", email)
        }
        await transporter.sendMail(mailOption)

        return res.json({ success: true })

    } catch (error) {
        return res.json({ success: false, message: error })
    }
}

// user login api
export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.json({ success: false, message: 'Provide all details' })
    }

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'Invalid email' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_DEV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// user logout api
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_DEV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })

        return res.json({ success: true, message: 'User logged out' })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// send verification otp to user's email api
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await userModel.findById(userId)
        if (user.isVerified) {
            return res.json({ success: false, message: 'Account already verified' })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 30 * 60 * 1000
        await user.save()

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account verification OTP",
            // text: `Your OTP is ${otp}. Verify your account using this OTP`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{email}}", user.email).replace("{{otp}}", otp)
        }
        await transporter.sendMail(mailOption)

        res.json({ success: true, message: 'Verification OTP sent on email' })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// verify the user through otp on email
export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body
    if (!userId || !otp) {
        return res.json({ success: false, message: 'Provide all details' })
    }

    try {
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'User is not found' })
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' })
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP was expired' })
        }

        user.isVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpireAt = 0
        await user.save()

        return res.json({ success: true, message: 'Email verified successfully!' })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        res.json({ success: true })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// send reset password otp
export const sendResetOtp = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.json({ success: false, message: 'Email is required' })
    }

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'User is not found' })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000
        await user.save()

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Password reset OTP!",
            // text: `Your OTP is ${otp}. Use this OTP for resetting your password`,
            html: PASSWORD_RESET_TEMPLATE.replace("{{email}}", email).replace("{{otp}}", otp)
        }
        await transporter.sendMail(mailOption)

        res.json({ success: true, message: 'OTP send to your email' })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// reset your password through email otp
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Provide all details' })
    }

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }
        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' })
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP was expired' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.resetOtp = ''
        user.resetOtpExpireAt = 0
        await user.save()

        res.json({ success: true, message: 'Password has changed successfully!' })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}