import { SET_NOTIFICATION } from "../constants";

export const setNotification = (notification) => ({
    type: SET_NOTIFICATION,
    payload: notification
});