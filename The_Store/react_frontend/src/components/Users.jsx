import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../redux/actionCreators/thunks/Users';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../redux/actionCreators/thunks/Users';
import { dataTestIds } from '../tests/constants/components';

const Users = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const users = useSelector(state => state.users);
    const currentUserId = useSelector(state => state.auth.user.id);

    const handleDelete = (id) => {
        dispatch(deleteUser(id))
    };
  
    const handleModify = (id) => {
        navigate(`/users/${id}/modify`);
    };

    useEffect(() => {
        if ( users.length === 0 ) {
            dispatch(getUsers());
        }
    }, []);

    return (
        <div data-testid="main-container">
            {users.length === 0 ? (
                <p data-testid="empty-container">No users found</p>
            ) : (
                <ul>
                    {users.map(user => (
                        <li key={user.id} data-testid={dataTestIds.containerId.listItem(user.id)}>
                            <p data-testid="name-value">{user.name}</p>
                            <p data-testid="role-value">{user.role}</p>
                            <Link to={`/users/${user.id}`} data-testid={dataTestIds.linkId.inspect(user.id)}>Inspect</Link>
                            
                            {user.id !== currentUserId && (
                                <div>
                                    <button data-testid='modify' onClick={() => handleModify(user.id)}>Modify</button>
                                    <button data-testid='delete' onClick={() => handleDelete(user.id)}>Delete</button>
                                </div>
                            )}

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Users;
