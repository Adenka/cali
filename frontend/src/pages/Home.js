import React from 'react'
import { useAuthContext } from '../utils/GlobalStateContext'
import { Button } from '@material-ui/core'
import { useFetchApi } from '../utils/apiMiddleware'
import { useSnackbar } from 'notistack'

export default function Home() {
    const { login } = useAuthContext().auth
    const { enqueueSnackbar } = useSnackbar()

    const fetchApi = useFetchApi()
    const check = async () => {
        const output = await fetchApi('testQuery', { id: 1 })
        console.log(output.result)
    }

    const snack = () => {
        enqueueSnackbar('Error', { variant: 'error' })
    }

    return (
        <div>
            {`Hello ${login}! <3`}
            <Button onClick={check}>Kliknij!</Button>
            <Button onClick={snack}>Kliknij!</Button>
        </div>
    )
}
