import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import NotFound from '../pages/NotFound'
import Home from '../pages/Home'
import Login from '../pages/Login'

export const routes = [
    { path: '/home', label: 'Home', component: Home },
    { path: '/login', label: 'Login', component: Login },
]

export default function Routes() {
    return (
        <Switch>
            {routes.map((r) => (
                <Route
                    key={r.path}
                    exact={r.exact}
                    path={r.path}
                    component={r.component}
                />
            ))}

            <Route exact path="/404" component={NotFound} />
            <Route exact path="/">
                <Redirect to="/home" />
            </Route>
            <Route path="*">
                <Redirect to="/404" />
            </Route>
        </Switch>
    )
}
