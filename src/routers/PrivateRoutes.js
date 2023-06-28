
import React from 'react'
import { Redirect } from 'react-router-dom';
import { Route } from "react-router-dom";

export const PrivateRoute = ({ component: Component, ...rest }) => {
    const role = JSON.parse(localStorage.getItem("role"));
    return (
        <Route {...rest} render={(props) => (
            role === 'itvip' || role === 'deployment'
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/',
                    state: { from: props.location }
                }} />
        )} />
    )

}