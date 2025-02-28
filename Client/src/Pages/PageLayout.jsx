import React from 'react'
import { Outlet } from 'react-router-dom'
import { assets } from '../assets/assets'
import Navbar from '../Components/Navbar'

const PageLayout = () => {
    return (
        <div className='relative min-h-screen grid grid-cols-1 grid-rows-[auto_1fr] cursor-default'>
            <img src={assets.grid} alt="grid" className='fixed w-full h-full -z-10 object-cover opacity-40' />
            <Navbar />
            <main className='relative flex flex-col md:flex-row justify-center items-center gap-4 xl:gap-6 min-h-screen p-4'>
                <Outlet />
            </main>
        </div>
    )
}

export default PageLayout