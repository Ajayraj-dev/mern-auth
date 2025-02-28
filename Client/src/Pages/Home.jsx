import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'
import { toast } from 'react-toastify'
import axiosInstance from '../Utils/AxiosInstance'

const Home = () => {
    const navigate = useNavigate()
    const { userData, setUserData, setIsLogged } = useContext(AppContext)
    const [data, setData] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
        toast.info(data)
        setData('')
    }

    const logout = async () => {
        try {
            const { data } = await axiosInstance.post('/api/auth/logout')
            data.success && setIsLogged(false)
            data.success && setUserData(false)
            navigate('/')
            toast.success('User LoggedOut!')
        } catch (error) {
            toast.error(error.message)
        }
    }

    const sendVerificationOtp = async () => {
        try {
            const { data } = await axiosInstance.post('/api/auth/sendVerifyOtp')
            if (data.success) {
                navigate('/mern/verifyEmail')
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='relative min-h-screen grid grid-cols-1 grid-rows-[auto_1fr] cursor-default'>
            <img src={assets.grid} alt="grid" className='fixed w-full h-full -z-10 object-cover opacity-40' />
            <header className='w-full bg-white border-b border-gray-300 shadow-lg flex justify-between items-center px-4 py-3 sm:py-2 absolute top-0 z-20'>
                <div className='flex justify-center items-center gap-2'>
                    <img src={assets.google} alt="logo" className='w-8 object-cover' />
                    <h1 className='text-xl text-slate-600 font-semibold'>MERN Auth</h1>
                </div>
                {userData ? (
                    <div className={`w-8 h-8 text-xl text-white font-semibold ${userData ? 'bg-slate-600' : 'bg-white'} flex justify-center items-center rounded-full
                    relative group`} onClick={() => setIsOpen(curr => !curr)}>
                        {userData && userData.name[0].toUpperCase()}
                        <div className={`${isOpen ? 'block' : 'hidden'} absolute border-[2px] border-slate-600 w-[130px] text-[16px] top-12 md:top-11 right-0 z-10 text-slate-700 rounded`}>
                            <ul className='list-none p-1 flex flex-col justify-center gap-1 w-full'>
                                {!userData.isVerified &&
                                    <li onClick={sendVerificationOtp} className='px-2 py-1 rounded hover:bg-blue-600 hover:text-white transition-all'>Verify Email</li>
                                }
                                <li onClick={logout} className='px-2 py-1 rounded hover:bg-blue-600 hover:text-white transition-all'>Logout</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <button className='px-4 py-1 border border-slate-600 text-slate-600 font-semibold rounded-md cursor-pointer
                            hover:bg-slate-600 hover:text-white transition-all'
                        onClick={() => navigate('/mern/login')}>Login</button>
                )}
            </header>
            <main className='relative flex flex-col md:flex-row justify-center items-center gap-4 xl:gap-6 min-h-screen p-4'>
                <img src={assets.robot} alt="robot" className='w-72 border-b-[2px] border-slate-400 hover:drop-shadow-xl transition-all' />
                <div className='p-2 flex flex-col justify-center items-center md:items-start gap-2'>
                    <h1 className='text-2xl text-slate-700 md:font-semibold flex justify-center md:justify-start items-center gap-2'>
                        Hey {userData ? userData.name : 'Developer'} <img src={assets.hand} alt="hand" className='w-8 aspect-square' /></h1>
                    <h2 className='text-3xl text-blue-600 md:text-4xl lg:text-5xl font-semibold'>Welcome to our app</h2>
                    {userData ?
                        <>
                            <input
                                type="text"
                                name='data'
                                value={data}
                                onChange={(e) => setData(e.target.value)}
                                placeholder='Store the links here'
                                autoComplete='off'
                                className='px-4 py-2 w-full mt-2 outline-2 outline-blue-600 rounded-[1px]' />
                            <button className='mt-4 px-4 py-2 bg-slate-600 text-white rounded cursor-pointer hover:bg-blue-600 transition-all'
                                onClick={handleClick}>Add Links</button>
                        </>
                        :
                        <>
                            <p className='text-lg text-slate-700 max-w-[650px]'>Let's start with a quick product tour. We create an authentication
                                for each user such as verify email and reset password here!</p>
                            <button className='mt-4 px-4 py-2 bg-slate-600 text-white rounded cursor-pointer hover:bg-blue-600 transition-all'>Get Started</button>
                        </>
                    }
                </div>
            </main>
        </div>
    )
}

export default Home