import { SET_OFFICERS, SET_ISAUTH, SET_ROLE, SET_POSTLOCAION, SET_OFFICERLIST, SET_POSTNAME} from "./contants";

export const setOfficers = payload => ({
    type: SET_OFFICERS,
    payload
});

export const set_isAuth = payload => ({
    type: SET_ISAUTH,
    payload
});

export const setRole = payload => ({
    type: SET_ROLE,
    payload
});

export const setPostLocation = payload => ({
    type: SET_POSTLOCAION,
    payload
});

export const setPostName = payload => ({
    type: SET_POSTNAME,
    payload
});
export const setOfficerList = payload => ({
    type: SET_OFFICERLIST,
    payload
});