import { login, register, logout, checkStatus } from '../authAction';
import { setNotification } from '../notificationAction';

export const checkAuthentication = () => async (dispatch) => {
    try {

        const response = await fetch(`http://localhost:3001/api/check-status`, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });

        if (response.ok) {
            const userData = await response.json();
            dispatch(checkStatus(userData));
        } else {
            console.error('Failed to chech authentication status:', response.statusText);
        }

    } catch (error) {
        console.error('Error fetching authentication status:', error);
    }
};

export const loginUser = (userData) => async (dispatch) => {
    try {
        dispatch(setNotification({message: "Loading login", state: "loading", stateType: "auth"}));

        const {email, password} = userData;

        const response = await fetch(`http://localhost:3001/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
            credentials: "include",
        });
  
        if (response.ok) {
            dispatch(setNotification({message: "Login successed", state: "success", stateType: "auth"}));
            const data = await response.json();
            dispatch(login(data));
        } else {
            const error = await response.json();
            dispatch(setNotification({message: error.error, state: "error", stateType: "auth"}));
        }

    } catch (error) {
        dispatch(setNotification({message: error, state: "error", stateType: "auth"}));
        console.error('Login failed:', error);
    }
};

export const registerUser = (userData) => async (dispatch) => {
    try {

        dispatch(setNotification({message: "Loading registering", state: "loading", stateType: "auth"}));

        const {name, email, password} = userData;

        const response = await fetch(`http://localhost:3001/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name, email, password}),
            credentials: "include",
        });
  
        if (response.ok) {
            dispatch(setNotification({message: "Welcome new customer! :)", state: "success", stateType: "auth"}));
            const data = await response.json();
            dispatch(register(data));
        } else {
            const error = await response.json();
            console.log(error);
            if (error.error.hasOwnProperty('email')) {
                dispatch(setNotification({message: error.error.email, state: "error", stateType: "auth"}));
            }
            else {
                dispatch(setNotification({message: error.error, state: "error", stateType: "auth"}));
            }        
        }

    } catch (error) {
        console.error('Registration failed:', error);
    }
};

export const logoutUser = () => async (dispatch) => {
    try {

        dispatch(setNotification({message: "Loading logout", state: "loading", stateType: "auth"}));

        const response = await fetch(`http://localhost:3001/api/logout`, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(setNotification({message: data.message, state: "success", stateType: "auth"}));
            dispatch(logout());
        } else {
            const error = await response.json();
            dispatch(setNotification({message: error.message, state: "error", stateType: "auth"}));
            console.error('Failed to logout', response.statusText);
        }
    } catch (error) {
        console.error('Logout failed:', error);
    }
};