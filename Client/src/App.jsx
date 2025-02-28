import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import VerifyEmail from './Pages/VerifyEmail'
import ResetPassword from './Pages/ResetPassword'
import PageLayout from './Pages/PageLayout'
import Register from './Pages/Register'
import { AppContextProvider } from './Context/AppContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'

const App = () => {
  return (
    <Router>
      <AppContextProvider>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/mern' element={<PageLayout />}>
            <Route path='/mern/login' element={<Login />} />
            <Route path='/mern/register' element={<Register />} />
            <Route path='/mern/verifyEmail' element={<VerifyEmail />} />
            <Route path='/mern/resetPassword' element={<ResetPassword />} />
          </Route>
        </Routes>
      </AppContextProvider>
    </Router>
  )
}

export default App