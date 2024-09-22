import { SET_NOTIFICATION } from "../constants";

const initialState = {
    message: null,
    state: null,
    stateType: null
  };

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_NOTIFICATION :
            return {
                ...state,
                message: action.payload.message,
                state: action.payload.state,
                stateType: action.payload.stateType
            }
        default:
            return state;
    }
};
  
export default notificationReducer;