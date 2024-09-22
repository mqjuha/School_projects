import React, { useState } from 'react';

import Login from './Login';
import Register from './Register';

const Auth = () => {
    const [showLogin, setShowLogin] = useState(true);

    const toggleComponent = () => {
        setShowLogin(prevState => !prevState);
    };

    return (
        <div>
        <button onClick={toggleComponent}>
            {showLogin ? 'Register' : 'Login'}
        </button>
        {showLogin ? <Login /> : <Register />}
        </div>
    );
};

export default Auth;
