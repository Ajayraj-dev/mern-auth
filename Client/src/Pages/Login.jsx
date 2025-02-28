import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../Context/AppContext'
import axiosInstance from '../Utils/AxiosInstance'

const Login = () => {
    const { setIsLogged, getUserData } = useContext(AppContext)
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            const { data } = await axiosInstance.post('/api/auth/login', { email, password })
            if (data.success) {
                setIsLogged(true)
                getUserData()
                setEmail('')
                setPassword('')
                navigate('/')
                toast.success('User loggedIn!')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            <img src={assets.google} alt="google" className='w-32' />
            <div className='border-[2px] border-slate-600 rounded-md p-4 max-w-[420px] flex flex-col justify-center items-center gap-4'>
                <h1 className='text-3xl text-slate-700 font-semibold'>Login</h1>
                <p className='text-xl text-blue-600'>Login to your account</p>
                <form onSubmit={handleSubmit} className='flex flex-col justify-center gap-2 w-full'>
                    <div className='mb-1 border border-slate-600 bg-gray-300 flex justify-between items-center gap-2 px-2.5 py-1.5 rounded-full'>
                        <img src={assets.email} alt="user" className='w-5' />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email ID'
                            autoComplete='off'
                            className='w-full outline-0' required />
                    </div>
                    <div className='border border-slate-600 bg-gray-300 flex justify-between items-center gap-2 px-2.5 py-1.5 rounded-full'>
                        <img src={assets.password} alt="user" className='w-5' />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                            autoComplete='off'
                            className='w-full outline-0' required />
                    </div>
                    <p onClick={() => navigate('/mern/resetPassword')} className='text-blue-600 cursor-pointer'>Forget Password?</p>
                    <button className='mt-4 px-4 py-2 bg-slate-600 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-all'>Login</button>
                </form>
                <p className='text-slate-700'>Don't have an account?
                    <span onClick={() => navigate('/mern/register')} className='ml-2 text-blue-600 cursor-pointer'>Sign Up</span></p>
            </div>
        </>
    )
}

export default Login