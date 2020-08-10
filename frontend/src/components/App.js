import React, { useState } from 'react'
import { useLocation, matchPath } from 'react-router-dom'
import {
    AppBar,
    Toolbar,
    CssBaseline,
    IconButton,
    createMuiTheme,
    ThemeProvider,
    Typography,
    Hidden,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { makeStyles } from '@material-ui/core/styles'
import * as colors from '@material-ui/core/colors'
import Routes, { routes } from '../utils/Routes'
import { SnackbarProvider } from 'notistack'
import Drawer from './Drawer'
import LogOutButton from './LogOutButton'

const lightTheme = createMuiTheme({
    palette: {
        type: 'light',
        primary: colors.cyan,
        secondary: colors.pink,
    },
})

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: colors.cyan,
        secondary: colors.pink,
    },
})

const useStyles = makeStyles({
    title: {
        paddingLeft: 8,
    },

    content: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    middleDiv: {
        flexGrow: 1,
    },
})

export default function App() {
    const [theme, setTheme] = useState(darkTheme)
    const classes = useStyles()
    const url = useLocation().pathname
    const [ifDrawerOpen, setIfDrawerOpen] = useState(false)

    const changeTheme = (dark) => {
        if (dark) {
            setTheme(darkTheme)
        } else {
            setTheme(lightTheme)
        }
    }

    const match = routes.filter((currRoute) =>
        matchPath(url, currRoute.path)
    )[0] || { label: '404: Not found' }

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <div>
                    <CssBaseline />
                    <AppBar position="static">
                        <Toolbar>
                            <Hidden lgUp>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={() => setIfDrawerOpen(true)}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Hidden>
                            <Typography variant="h5" className={classes.title}>
                                {match.label}
                            </Typography>
                            <div className={classes.middleDiv}></div>
                            <LogOutButton />
                        </Toolbar>
                    </AppBar>
                    <div className={classes.content}>
                        <Drawer open={ifDrawerOpen} setOpen={setIfDrawerOpen} />
                        <Routes />
                    </div>
                </div>
            </SnackbarProvider>
        </ThemeProvider>
    )
}
