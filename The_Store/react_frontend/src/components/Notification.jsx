import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { dataTestIds } from '../tests/constants/components';
import { useState, useEffect } from 'react';
import { setNotification } from '../redux/actionCreators/notificationAction';

const Notification = () => {
  const dispatch = useDispatch();
  const [timerId, setTimerId] = useState(null);
  const notification = useSelector(state => state.notification);

  // Clear timer
  useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, []);

  // Set timer
  useEffect(() => {
    if (notification.message !== null) {
      // Remove previous timer
      if (timerId) {
        clearTimeout(timerId);
      }
      // Set new timer
      const id = setTimeout(() => {
        clearNotification();
      }, 5000); // 5000 milliseconds = 5 seconds
      setTimerId(id);
    }
  }, [notification]);

  // Clear notification
  const clearNotification = () => {
    if (timerId) {
      clearTimeout(timerId);
    }
    dispatch(setNotification({ message: null, state: null, stateType: null }))
  };

  console.log(notification);

  return (
    notification.message === null ? (
      <p data-testid="empty-container"></p>
    ) : (
      <div data-testid="notifications-container">
        {notification.state === "success" ? (
          <div data-testid={dataTestIds.notificationId.success(notification.stateType)}>
            {notification.message}
          </div>

        ) : notification.state === "error" ? (
          <div data-testid={dataTestIds.notificationId.error(notification.stateType)}>
            {notification.message}
          </div>

        ) : notification.state === "loading" ? (
          <div data-testid={dataTestIds.notificationId.loading(notification.stateType)}>
            {notification.message}
          </div>

        ) : null}
      </div>
    )
  );
};

export default Notification;