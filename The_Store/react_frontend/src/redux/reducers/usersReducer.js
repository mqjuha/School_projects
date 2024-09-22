import { GET_USERS, MODIFY_USER, DELETE_USER } from "../constants";

const initialState = []; //users
  
const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USERS:
            return action.payload;
        case MODIFY_USER:
            const modifiedUsers = state.map(user => {

                console.log(user.id, action.payload.id);

                if ( user.id === action.payload.id ) {
                    console.log("modifiedUsers", action.payload);
                    return action.payload;
                }
                else {
                    return user;
                }
            }

                //user.id === action.payload.userId ? action.payload.updatedUser : user
            );
            console.log(modifiedUsers);
            return modifiedUsers;
        case DELETE_USER:
            const filteredUsers = state.filter(user => user.id !== action.payload);
            return filteredUsers;
        default:
            return state;
    }
};
  
export default usersReducer;