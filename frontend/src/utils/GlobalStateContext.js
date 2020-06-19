import React, { createContext, useState, useContext } from 'react'

const AuthContext = createContext('xD')
export const useAuthContext = () => useContext(AuthContext)

export function GlobalStateProvider({ children }) {
    const initialAuth = JSON.parse(localStorage.getItem('auth')) ||
        JSON.parse(sessionStorage.getItem('auth')) || {
            login: null,
            token: null,
        }

    const [auth, setAuth] = useState(initialAuth)

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
