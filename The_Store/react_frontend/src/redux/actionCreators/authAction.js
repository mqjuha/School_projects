import { LOGIN, REGISTER, LOGOUT, CHECK_STATUS } from '../constants';

export const checkStatus = (userData) => ({
    type: CHECK_STATUS,
    payload: userData,
});

export const login = (user) => ({
    type: LOGIN,
    payload: user,
});

export const register = (user) => ({
    type: REGISTER,
    payload: user,
});

export const logout = () => ({
    type: LOGOUT,
});
