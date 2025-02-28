import React, { useContext, useEffect } from 'react'
import { toast } from 'react-toastify'
import axiosInstance from '../Utils/AxiosInstance'
import { AppContext } from '../Context/AppContext'
import { useNavigate } from 'react-router-dom'

const VerifyEmail = () => {
    const { isLogged, userData, getUserData } = useContext(AppContext)
    const navigate = useNavigate()
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

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            const otpArray = inputRefs.current.map(e => e.value)
            const otp = otpArray.join('')

            const { data } = await axiosInstance.post('/api/auth/verifyEmail', { otp })
            if (data.success) {
                toast.success(data.message)
                getUserData()
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        isLogged && userData && userData.isVerified && navigate('/')
    }, [isLogged, userData])

    return (
        <>
            <form onSubmit={handleSubmit} className='border-[2px] border-slate-600 rounded-md p-4 max-w-[420px] flex flex-col justify-center items-center gap-4'>
                <h1 className='text-3xl text-slate-700 font-semibold'>Email verify OTP</h1>
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
                <button className='w-full mt-4 px-4 py-2 bg-slate-600 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-all'>Verify Email</button>
            </form>
        </>
    )
}

export default VerifyEmail