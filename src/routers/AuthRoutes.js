
import React from 'react'
import { Redirect } from 'react-router-dom';
import { Route } from "react-router-dom";


export const AuthRoute = ({ component: Component, ...rest }) => {
    const auth = JSON.parse(localStorage.getItem("isAuth"));
    return (
        <Route {...rest} render={(props) => (
            auth
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/',
                    state: { from: props.location }
                }} />
        )} />
    )

}