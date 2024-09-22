import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { dataTestIds } from '../tests/constants/components';

import { registerUser } from '../redux/actionCreators/thunks/Auth';
import { setNotification } from '../redux/actionCreators/notificationAction';

import { validEmailRegex } from '../tests/constants/components';

const Register = () => {
    const [userData, setUserData] = useState({ name: '', email: '', password: '', passwordConfirmation: '' });

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1.) Name is shorter than 3 characters
        if (userData.name.length < 3) {
            dispatch(setNotification({message: 'Name must be at least 3 characters long.', state: "error", stateType: "auth"}));
            return;
        }
        
        /* 2.) Email is not of a valid format, i.e., username@tuni.fi. 
        You can use the validEmailRegex provided in the src/tests/constants/components file 
        to make sure the provided email is in valid form, */
        if (!validEmailRegex.test(userData.email)) {
            dispatch(setNotification({message: 'Email is not of a valid format. Use format: username@tuni.fi', state: "error", stateType: "auth"}));
            return;
        }
    
        // 3.) Password is shorter than 10 characters
        if (userData.password.length < 10) {
            dispatch(setNotification({message: 'Password must be at least 10 characters long.', state: "error", stateType: "auth"}));
            return;
        }
    
        // 4.) Password and Password confirmation are not the same.
        if (userData.password !== userData.passwordConfirmation) {
            dispatch(setNotification({message: 'Passwords do not match.', state: "error", stateType: "auth"}));
            return;
        }

        dispatch(registerUser(userData));
    };

    return (
        <div>

            <h2>Register</h2>

            <form data-testid="form-container" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={userData.name} 
                    onInput={(e) => setUserData(prevState => ({ ...prevState, name: e.target.value }))} 
                    placeholder="Name" 
                    data-testid="name-input"
                required />
                <input 
                    type="email" 
                    value={userData.email}
                    onInput={(e) => setUserData(prevState => ({ ...prevState, email: e.target.value }))} 
                    placeholder="Email"
                    data-testid="email-input"
                required />
                <input 
                    type="password"
                    value={userData.password}
                    onInput={(e) => setUserData(prevState => ({ ...prevState, password: e.target.value }))} 
                    placeholder="Password"
                    data-testid="password-input"
                required />
                <input
                    type="password"
                    value={userData.passwordConfirmation}
                    onInput={(e) => setUserData(prevState => ({ ...prevState, passwordConfirmation: e.target.value }))} 
                    placeholder="Password confirmation"
                    data-testid="passwordConfirmation-input"
                required />
                <button type="submit" data-testid="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
