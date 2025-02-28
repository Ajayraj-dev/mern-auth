import React from 'react'
import { assets } from '../assets/assets'

const Navbar = () => {
    return (
        <header className='w-full bg-white border-b border-gray-300 shadow-lg flex justify-start items-center px-4 py-3 sm:py-2 absolute top-0 z-20'>
            <div className='flex justify-center items-center gap-2'>
                <img src={assets.google} alt="logo" className='w-8 object-cover' />
                <h1 className='text-xl text-slate-600 font-semibold'>MERN Auth</h1>
            </div>
        </header>
    )
}

export default Navbar