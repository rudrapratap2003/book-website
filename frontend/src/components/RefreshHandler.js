import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from "js-cookie"

const RefreshHandler = ({setIsAuthenticated}) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const hasToken = Boolean(Cookies.get("token"))
        setIsAuthenticated(hasToken)
        if(hasToken && (location.pathname === '/login' || location.pathname==='/signup')) {
            navigate('/',{replace: true})
        }
    },[location,navigate,setIsAuthenticated])

    return null;
}

export default RefreshHandler
