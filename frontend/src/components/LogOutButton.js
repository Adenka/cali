import React from 'react'
import {
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { useAuthContext } from '../utils/GlobalStateContext'
import { useFetchApi } from '../utils/apiMiddleware'
import { useHistory } from 'react-router-dom'

export default function LogOutButton({ insideList }) {
    const fetchApi = useFetchApi()
    const {
        setAuth,
        auth: { login, token },
    } = useAuthContext()
    const history = useHistory()

    const logout = async () => {
        await fetchApi('logout', { token })

        history.push('/home')

        setAuth({ login: null, token: null })
        ;(token[0] === '1' ? localStorage : sessionStorage).removeItem('auth')
    }

    return (
        <>
            {login !== null ? (
                insideList ? (
                    <ListItem button onClick={logout}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                ) : (
                    <IconButton edge="end" color="inherit" onClick={logout}>
                        <ExitToAppIcon />
                    </IconButton>
                )
            ) : null}
        </>
    )
}
