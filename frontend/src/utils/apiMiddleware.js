import { useAuthContext } from './GlobalStateContext'
import { useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'

//const address = 'http://localhost:5000/api'
const address = 'https://cali.ct8.pl/api'

const throwError = (code, message) => (error) => {
    throw { code, message }
}

const throwIf = (func, code, message) => (res) => {
    if (!func(res)) {
        return res
    } else {
        return throwError(code, message)()
    }
}

const useFetchApi = () => {
    const { auth, setAuth } = useAuthContext()
    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar()

    const fetchApi = async (endpoint, args) => {
        const res = await fetch(address, {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                endpoint,
                args: {
                    auth,
                    ...args,
                },
            }),
        }).catch(throwError(683, 'Network Error')) //ustandaryzowac bledy!!!

        const data = await res.json().catch(throwError(547, 'JSON Error'))

        if (data.error) {
            if (data.error.code === 401) {
                setAuth({ login: null, token: null })
                history.push('/login')
            }
            enqueueSnackbar(data.error.message, { variant: 'error' })
            throw JSON.stringify(data.error)
        }

        return data
    }

    return fetchApi
}

export { useFetchApi, throwIf, throwError }
