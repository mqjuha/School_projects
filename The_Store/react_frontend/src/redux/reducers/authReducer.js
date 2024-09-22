import { LOGIN, REGISTER, LOGOUT, CHECK_STATUS } from "../constants";

const initialState = {
  user: {
    role: 'guest',
  },
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHECK_STATUS:
            return { 
                ...state, 
                user: action.payload.user 
            };
        case LOGIN:
            return {
                ...state,
                user: action.payload.user,
            };
        case REGISTER:
            return {
                ...state,
                user: action.payload.user
            };
        case LOGOUT:
            return {
                ...state,
                user: {
                    role: 'guest'
                }
            };
        default:
            return state;
    }
};

export default authReducer;
