import React, { useState } from 'react'
import { useLocation, matchPath } from 'react-router-dom'
import {
    AppBar,
    Toolbar,
    CssBaseline,
    IconButton,
    createMuiTheme,
    ThemeProvider,
    SwipeableDrawer,
    Typography,
    List,
    ListItem,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { makeStyles } from '@material-ui/core/styles'
import * as colors from '@material-ui/core/colors'
import Routes, { routes } from '../utils/Routes'
import { SnackbarProvider } from 'notistack'

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
    drawer: {
        width: 256,
    },
    title: {
        paddingLeft: 8,
    },
})

export default function App() {
    const [theme, setTheme] = useState(darkTheme)
    const [ifDrawerOpen, setIfDrawerOpen] = useState(false)
    const classes = useStyles()
    const url = useLocation().pathname

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

    const drawerItems = [
        { label: 'pies' },
        { label: 'Kajtek' },
        { label: 'kot' },
        { label: 'nietopyrz' },
    ]

    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <div>
                    <CssBaseline />
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={() => setIfDrawerOpen(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h5" className={classes.title}>
                                {match.label}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <SwipeableDrawer
                        anchor="left"
                        open={ifDrawerOpen}
                        onClose={() => setIfDrawerOpen(false)}
                        onOpen={() => setIfDrawerOpen(true)}
                    >
                        <div className={classes.drawer}>
                            <List>
                                {drawerItems.map((drawerItem) => (
                                    <ListItem button key={drawerItem.label}>
                                        {drawerItem.label}
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </SwipeableDrawer>
                    <Routes />
                </div>
            </SnackbarProvider>
        </ThemeProvider>
    )
}
