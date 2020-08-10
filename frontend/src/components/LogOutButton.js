import React from 'react'
import { IconButton } from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { useAuthContext } from '../utils/GlobalStateContext'
import { useFetchApi } from '../utils/apiMiddleware'
import { useHistory } from 'react-router-dom'

export default function LogOutButton() {
    const fetchApi = useFetchApi()
    const {
        setAuth,
        auth: { login, token },
    } = useAuthContext()
    const history = useHistory()

    const logOut = async () => {
        await fetchApi('logout', { login, token })

        history.push('/404')

        setAuth({ login: null, token: null })
        ;(token[0] === '1' ? localStorage : sessionStorage).removeItem('auth')
    }

    return (
        <IconButton edge="end" color="inherit" onClick={() => logOut()}>
            <ExitToAppIcon />
        </IconButton>
    )
}
