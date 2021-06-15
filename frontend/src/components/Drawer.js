import React, { useState } from 'react'
import {
    SwipeableDrawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Divider,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useAuthContext } from '../utils/GlobalStateContext'
import LogOutButton from './LogOutButton'

const useStyles = makeStyles({
    drawer: {
        width: 256,
    },
})

function ListItemLink({ icon, label, to }) {
    const renderLink = React.useMemo(
        () =>
            React.forwardRef((itemProps, ref) => (
                <Link to={to} ref={ref} {...itemProps} />
            )),
        [to]
    )

    return (
        <li>
            <ListItem button component={renderLink}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={label} />
            </ListItem>
        </li>
    )
}

export default function Drawer({ open, setOpen }) {
    const classes = useStyles()

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'))

    const { login } = useAuthContext().auth
    const drawerItems = !login
        ? [
              { label: 'Home', path: '/home' },
              { label: 'Login', path: '/login' },
              { divider: true },
              { label: 'About us', path: '/404' },
          ]
        : [
              { label: 'Dashboard', path: '/404' },
              { label: 'Week', path: '/404' },
              { label: 'Month', path: '/404' },
              { label: 'Task List', path: '/404' },
              { divider: true },
              { label: 'Activities', path: '/404' },
              { label: 'Plans', path: '/404' },
              { divider: true },
              { label: 'Settings', path: '/404' },
              { divider: true },
              { label: 'About us', path: '/404' },
          ]

    const content = (
        <div className={classes.drawer}>
            <List>
                {drawerItems.map((drawerItem) =>
                    !drawerItem.divider ? (
                        <ListItemLink
                            key={drawerItem.label}
                            label={drawerItem.label}
                            to={drawerItem.path}
                        />
                    ) : (
                        <Divider />
                    )
                )}
                {login && isMobile && <LogOutButton insideList />}
            </List>
        </div>
    )

    return (
        <>
            {isMobile ? (
                <SwipeableDrawer
                    anchor="left"
                    open={open}
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                >
                    {content}
                </SwipeableDrawer>
            ) : (
                <Paper style={{ margin: 16 }}>{content}</Paper>
            )}
        </>
    )
}
