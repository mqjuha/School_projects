import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { modifyUser } from '../redux/actionCreators/thunks/Users';
import { setNotification } from '../redux/actionCreators/notificationAction';

const UserModifyPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userId } = useParams();
    
    const users = useSelector(state => state.users);
    const user = users.find(user => user.id === userId);

    const [role, setRole] = useState("");

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if( user.role === role ) {
            dispatch(setNotification({ message: "New role can't be same than old one", state: "error", stateType: "user"}));
        }
        else {
            dispatch(modifyUser(userId, role))
            .then(() => {
                navigate("/users");
            });
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    useEffect(() => {
        setRole(user.role)
    }, [user.id])

    console.log("Role", role);
    console.log("User role", user.role);
    return (
        <div data-testid="form-container">
            <h2>Modify User</h2>
            <form onSubmit={handleSubmit}>

                <div>
                    <label data-testid="name-value">
                        Name: {user.name}
                    </label>
                </div>

                <div>
                    <label>
                        Role:
                        <select value={role} onChange={handleRoleChange} data-testid="role-select">
                            <option value="customer">customer</option>
                            <option value="admin">admin</option>
                        </select>
                    </label>
                </div>
                
                <button type="submit" data-testid="submit" disabled={role === user.role}>Submit</button>
                <button type="button" data-testid="cancel" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default UserModifyPage;
