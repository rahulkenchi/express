import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
export default function Home() {
    const navigate = useNavigate()
    useEffect(() => {
        if (sessionStorage.getItem('user') != undefined)
            navigate("/menu")
        else {
            navigate("/login")
        }
    }, [])

    return (
        <div>

        </div>
    )
}
