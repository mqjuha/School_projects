import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import User from '../components/User';

function UserPage() {
    const { userId } = useParams();
    
    const users = useSelector(state => state.users);
    const user = users.find(user => user.id === userId);

    return (
        <div>
            <h2>User Detail Page</h2>
            <User
                key={userId}
                user={user}
            /> 
        </div>
    );
}
  
export default UserPage;