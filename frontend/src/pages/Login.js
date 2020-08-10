import React, { useState } from 'react'
import {
    Paper,
    TextField,
    Button,
    Link,
    Tabs,
    Tab,
    Collapse,
    Checkbox,
    FormControlLabel,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useFetchApi } from '../utils/apiMiddleware'
import { useAuthContext } from '../utils/GlobalStateContext'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    wrapper: {
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexGrow: 1,
    },

    container: {
        margin: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 500,
        display: 'flex',
        flexDirection: 'column',
    },

    tabs: {
        paddingBottom: theme.spacing(2),
    },

    button: {
        width: '100%',
        padding: theme.spacing(2),
    },

    link: {
        marginTop: theme.spacing(3),
        margin: 'auto',
        justifyContent: 'center',
    },
}))

const useFormInput = (initialValue) => {
    const [value, setValue] = useState(initialValue)
    const [valueError, setValueError] = useState('')

    const changeValue = (event) => {
        setValue(event.target.value)
    }

    return [value, changeValue, valueError, setValueError]
}

export default function Login() {
    const classes = useStyles()

    const [loginOrRegister, setLoginOrRegister] = useState(0)
    const [login, changeLogin, loginError, setLoginError] = useFormInput('')
    const [
        password,
        changePassword,
        passwordError,
        setPasswordError,
    ] = useFormInput('')
    const [
        confirmPassword,
        changeConfirmPassword,
        confirmPasswordError,
        setConfirmPasswordError,
    ] = useFormInput('')

    const [rememberMe, setRememberMe] = useState(false)

    const { setAuth } = useAuthContext()

    const history = useHistory()

    const fetchApi = useFetchApi()

    const submit = async (event) => {
        let success = true

        if (login.length === 0) {
            setLoginError('Enter a login!')
            success = false
        } else {
            setLoginError('')
        }

        if (password.length < 8) {
            setPasswordError('Password too short!')
            success = false
        } else {
            setPasswordError('')
        }

        if (loginOrRegister === 1) {
            if (password !== confirmPassword) {
                setConfirmPasswordError('Must be the same as password!')
                success = false
            } else {
                setConfirmPasswordError('')
            }
        }

        if (success) {
            const { token } = await fetchApi(
                loginOrRegister === 0 ? 'login' : 'register',
                {
                    login,
                    password,
                    persistent: rememberMe,
                }
            )
            console.log('Token:', token)

            setAuth({ login, token })
            history.push('/home')
            ;(rememberMe ? localStorage : sessionStorage).setItem(
                'auth',
                JSON.stringify({ login, token })
            )
        }
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.container}>
                <Paper style={{ padding: '10px 24px 24px 24px' }}>
                    <div className={classes.tabs}>
                        <Tabs
                            value={loginOrRegister}
                            onChange={(event, newValue) =>
                                setLoginOrRegister(newValue)
                            }
                            indicatorColor="primary"
                            textColor="primary"
                            centered
                        >
                            <Tab label="Login" />
                            <Tab label="Register" />
                        </Tabs>
                    </div>
                    <TextField
                        label="Login"
                        fullWidth
                        variant="filled"
                        value={login}
                        onChange={changeLogin}
                        error={loginError !== ''}
                        helperText={loginError || ' '}
                    />
                    <TextField
                        label="Password"
                        fullWidth
                        variant="filled"
                        type="password"
                        value={password}
                        onChange={changePassword}
                        error={passwordError !== ''}
                        helperText={passwordError || ' '}
                    />
                    <Collapse in={loginOrRegister === 1}>
                        <TextField
                            label="Confirm password"
                            fullWidth
                            variant="filled"
                            type="password"
                            value={confirmPassword}
                            onChange={changeConfirmPassword}
                            error={confirmPasswordError !== ''}
                            helperText={confirmPasswordError || ' '}
                        />
                    </Collapse>
                    <Collapse in={loginOrRegister === 0}>
                        <Button
                            variant="contained"
                            className={classes.button}
                            onClick={submit}
                        >
                            Login
                        </Button>
                    </Collapse>
                    <Collapse in={loginOrRegister === 1}>
                        <Button
                            variant="contained"
                            className={classes.button}
                            onClick={submit}
                        >
                            Register
                        </Button>
                    </Collapse>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={rememberMe}
                                onChange={(event) =>
                                    setRememberMe(event.target.checked)
                                }
                            />
                        }
                        label="Remember me"
                    />
                </Paper>
                <Collapse in={loginOrRegister === 0}>
                    <div className={classes.link}>
                        <Link>Forgot your password sweetie?</Link>
                    </div>
                </Collapse>
            </div>
        </div>
    )
}
