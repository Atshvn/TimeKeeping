import { SET_ISAUTH, SET_OFFICERLIST, SET_OFFICERS, SET_POSTLOCAION, SET_POSTNAME, SET_ROLE } from "./contants";

const auth = JSON.parse(localStorage.getItem("isAuth"));
const role = JSON.parse(localStorage.getItem("role"));
const postLocation = JSON.parse(localStorage.getItem("postLocation"));
const postName = JSON.parse(localStorage.getItem("postName"));
export const initState = {
    officers: [],
    isAuth: auth || false,
    role: role || "user",
    postLocation: postLocation || 0,
    postName: postName || '',
};

export const reducer = (state, action) => {
    console.log(state, action, 'state, action')
    switch (action.type) {
        case SET_OFFICERS:
            return {
                ...state,
                officers: [...state.officers, ...action.payload]
            };

        case SET_ISAUTH:
            return {
                ...state,
                isAuth: action.payload
            };
        case SET_ROLE:
            return {
                ...state,
                role: action.payload
            };
        case SET_POSTLOCAION:
            return {
                ...state,
                postLocation: action.payload
            };
            case SET_POSTNAME:
            return {
                ...state,
                postName: action.payload
            };
        case SET_OFFICERLIST:
            return {
                ...state,
                officers: action.payload
            };
        default:
            return state;
    }
};


