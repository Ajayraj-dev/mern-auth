import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosInstance from '../Utils/AxiosInstance'

const ResetPassword = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isEmailSent, setIsEmailSent] = useState('')
    const [otp, setOtp] = useState(0)
    const [isOtpSubmit, setIsOtpSubmit] = useState(false)
    const inputRefs = React.useRef([])

    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.split('')
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char
            }
        })
    }

    const onSubmitEmail = async (e) => {
        try {
            e.preventDefault()
            const { data } = await axiosInstance.post('/api/auth/sendResetOtp', { email })
            if (data.success) {
                toast.success(data.message)
                setIsEmailSent(true)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const onSubmitOtp = async (e) => {
        try {
            e.preventDefault()
            const otpArray = inputRefs.current.map(e => e.value)
            setOtp(otpArray.join(''))
            setIsOtpSubmit(true)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const onSubmitNewPassword = async (e) => {
        try {
            e.preventDefault()
            const { data } = await axiosInstance.post('/api/auth/resetPassword', { email, otp, newPassword })
            if (data.success) {
                toast.success(data.message)
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            {!isEmailSent && (
                <form onSubmit={onSubmitEmail} className='border-[2px] border-slate-600 rounded-md p-4 max-w-[420px] flex flex-col justify-center items-center gap-4'>
                    <h1 className='text-3xl text-slate-700 font-semibold'>Reset Password</h1>
                    <p className='text-xl text-blue-600'>Enter your registered email address</p>
                    <div className='mb-1 border border-slate-600 bg-gray-300 flex justify-between items-center gap-2 px-2.5 py-1.5 rounded-full'>
                        <img src={assets.email} alt="user" className='w-5' />
                        <input
                            type="email"
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email ID'
                            autoComplete='off'
                            className='w-full outline-0' required />
                    </div>
                    <button className='w-full mt-4 px-4 py-2 bg-slate-600 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-all'>Submit</button>
                </form>
            )}

            {!isOtpSubmit && isEmailSent && (
                <form onSubmit={onSubmitOtp} className='border-[2px] border-slate-600 rounded-md p-4 max-w-[420px] flex flex-col justify-center items-center gap-4'>
                    <h1 className='text-3xl text-slate-700 font-semibold'>Reset Password OTP</h1>
                    <p className='text-xl text-blue-600'>Enter 6-digit OTP code sent to your email</p>
                    <div onPaste={handlePaste} className='flex justify-between gap-2 md:gap-4'>
                        {Array(6).fill(0).map((_, index) => (
                            <input
                                key={index}
                                ref={e => inputRefs.current[index] = e}
                                onInput={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                type="text"
                                maxLength='1'
                                className='w-11 h-11 md:w-12 md:h-12 bg-gray-300 text-slate-700 text-xl text-center rounded-md'
                                required />
                        ))}
                    </div>
                    <button className='w-full mt-4 px-4 py-2 bg-slate-600 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-all'>Submit</button>
                </form>
            )}

            {isEmailSent && isOtpSubmit && (
                <form onSubmit={onSubmitNewPassword} className='border-[2px] border-slate-600 rounded-md p-4 max-w-[420px] flex flex-col justify-center items-center gap-4'>
                    <h1 className='text-3xl text-slate-700 font-semibold'>New Password</h1>
                    <p className='text-xl text-blue-600'>Enter the new password</p>
                    <div className='mb-1 border border-slate-600 bg-gray-300 flex justify-between items-center gap-2 px-2.5 py-1.5 rounded-full'>
                        <img src={assets.password} alt="password" className='w-5' />
                        <input
                            type="password"
                            name='newPassword'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder='New Password'
                            autoComplete='off'
                            className='w-full outline-0' required />
                    </div>
                    <button className='w-full mt-4 px-4 py-2 bg-slate-600 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-all'>Submit</button>
                </form>
            )}
        </>
    )
}

export default ResetPassword