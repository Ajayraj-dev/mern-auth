import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import axiosInstance from "../Utils/AxiosInstance";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.BACKEND_URL || 'http://localhost:5000'
    const [isLogged, setIsLogged] = useState(false)
    const [userData, setUserData] = useState(false)

    const getAuthStatus = async () => {
        try {
            const { data } = await axiosInstance.get('/api/auth/isAuthenticated')
            if (data.success) {
                setIsLogged(true)
                getUserData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axiosInstance.get('/api/user/data')
            data.success ? setUserData(data.userData)
                : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getAuthStatus()
    }, [])

    const value = {
        backendUrl,
        isLogged, setIsLogged,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}