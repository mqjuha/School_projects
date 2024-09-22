import { SET_PRODUCT } from "../constants";

export const selectedProductReducer = ( state = {}, action ) => {
    switch (action.type) {
        case SET_PRODUCT :
            return action.payload
        default :
            return state
    }
}