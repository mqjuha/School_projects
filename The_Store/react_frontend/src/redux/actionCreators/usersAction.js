import { GET_USERS, MODIFY_USER, DELETE_USER } from "../constants";

export const setUsers = (users) => ({
    type: GET_USERS,
    payload: users
});

export const updateUser = (updatedUser) => ({
    type: MODIFY_USER,
    payload: updatedUser,
});
  
export const removeUser = (userId) => ({
    type: DELETE_USER,
    payload: userId,
});