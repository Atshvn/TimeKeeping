import React , 
{ useReducer } from "react";
import Context from "./Context";
import { logger } from "./logger";
import { initState, reducer } from "./reducer";

function Provider({children}) {
    const [state, dispatch] = useReducer(logger(reducer), initState);

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
}

export default Provider;
