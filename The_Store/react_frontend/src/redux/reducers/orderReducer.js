import { SET_SELECTED_ORDER } from "../constants";

export const selectedOrderReducer = ( state = {}, action ) => {
    switch (action.type) {
        case SET_SELECTED_ORDER :
            return action.payload
        default :
            return state
    }
}