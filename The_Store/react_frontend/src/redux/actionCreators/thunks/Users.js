import { setUsers, updateUser, removeUser } from "../usersAction";
import { setNotification } from "../notificationAction";

export const getUsers = () => async (dispatch) => {
    try {
        dispatch(setNotification({message: "Loading users...", state: "loading", stateType: "user"}));

        const response = await fetch(`http://localhost:3001/api/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });
    
        if (response.ok) {
            dispatch(setNotification({message: "Users are now available!", state: "success", stateType: "user"}));
            const data = await response.json();
            dispatch(setUsers(data));
        } else {
            const error = await response.json();
            dispatch(setNotification({message: error.error, state: "error", stateType: "user"}));
        }
    } catch (error) {
        dispatch(setNotification({message: error, state: "error", stateType: "user"}));
        console.error(error);
    }
};

export const modifyUser = (userId, updatedRole) => async (dispatch) => {
    try {
  
        dispatch(setNotification({message: "Modifying...", state: "loading", stateType: "user"}));
    
        const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify({ role: updatedRole}),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        });
  
        if (response.ok) {
            const updatedUser = await response.json();
            console.log("updated", updatedUser);
            dispatch(updateUser(updatedUser));
            dispatch(setNotification({message: "The user is updated!", state: "success", stateType: "user"}));
        }
        else {
            const error = await response.json();
            dispatch(setNotification({message: error.error, state: "error", stateType: "user"}));
            console.error('Failed to update user:', error);
        }  
    } catch (error) {
        dispatch(setNotification({message: error, state: "error", stateType: "user"}));
        console.error('Failed to update user:', error);
    }
};
  
export const deleteUser = (userId) => async (dispatch) => {
    try {
  
        dispatch(setNotification({message: "Deleteting...", state: "loading", stateType: "user"}));
  
        const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include"
        });
  
        if (response.ok) {
            dispatch(setNotification({message: "The user is deleted!", state: "success", stateType: "user"}));
            dispatch(removeUser(userId));
        }
        else {
            const error = await response.json();
            dispatch(setNotification({message: error.error, state: "error", stateType: "user"}));
            console.error('Failed to delete user:', error.error);
        } 
    } catch (error) {
        dispatch(setNotification({message: error, state: "error", stateType: "user"}));
        console.error('Failed to delete user:', error);
    }
};