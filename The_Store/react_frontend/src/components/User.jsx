import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../redux/actionCreators/thunks/Users';

const User = ({ user }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const currentUserId = useSelector(state => state.auth.user.id);

    const handleDelete = (id) => {
        dispatch(deleteUser(id))
    };
  
    const openModifyPage = (id) => {
        navigate(`/users/${id}/modify`);
    };

    return (
        <div data-testid="inspect-container">
            <p data-testid="name-value">Name: {user.name}</p>
            <p data-testid="role-value">Role: {user.role}</p>
            <p data-testid="email-value">Email: {user.email}</p>
            {user.id !== currentUserId && (
                <>
                    <button data-testid="modify" onClick={() => openModifyPage(user.id)}>Modify</button>
                    <button data-testid="delete" onClick={() => handleDelete(user.id)}>Delete</button>
                </>
            )}
            <div>
                <Link to="/users">Back to Users</Link>
            </div>
        </div>
    );
};

export default User;
