import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { loginUser } from '../redux/actionCreators/thunks/Auth';
import { setNotification } from '../redux/actionCreators/notificationAction';

import { validEmailRegex } from '../tests/constants/components';

const Login = () => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    const dispatch = useDispatch();

    const navigate = useNavigate();
    const notification = useSelector(state => state.notification);
  
    useEffect(() => {
      if (notification.message === 'Login successed') {
        navigate('/');
      }
    }, [notification.message, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        /* 2.) Email is not of a valid format, i.e., username@tuni.fi. 
        You can use the validEmailRegex provided in the src/tests/constants/components file 
        to make sure the provided email is in valid form, */
        if (!validEmailRegex.test(loginData.email)) {
            dispatch(setNotification({message: 'Email is not of a valid format. Use format: username@tuni.fi', state: "error", stateType: "auth"}));
            return;
        }
    
        // 3.) Password is shorter than 10 characters
        if (loginData.password.length < 10) {
            dispatch(setNotification({message: 'Password must be at least 10 characters long.', state: "error", stateType: "auth"}));
            return;
        }

        dispatch(loginUser(loginData));
    };

    return (
        <div>
            <h2>Login</h2>

            <form data-testid="form-container" onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    value={loginData.email} 
                    onInput={(e) => setLoginData(prevState => ({ ...prevState, email: e.target.value }))} 
                    placeholder="Email" 
                    data-testid="email-input" 
                required />
                <input 
                    type="password"
                    value={loginData.password}
                    onInput={(e) => setLoginData(prevState => ({ ...prevState, password: e.target.value }))} 
                    placeholder="Password" 
                    data-testid="password-input"
                required />
                <button type="submit" data-testid="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
