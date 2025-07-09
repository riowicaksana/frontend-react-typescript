import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store';
import { logout } from '../slices/authSlice';

const Navbar: React.FC = () => {
    const auth = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="navbar bg-base-100 shadow">
            <div className="flex-1">
                <Link to="/login" className="btn btn-ghost normal-case text-xl">WarehouseApp</Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    {auth.user ? (
                        <>
                            <li>
                                <span className="flex items-center">
                                    Hi, {auth.user.username}
                                </span>
                            </li>
                            <li>
                                <div className="avatar avatar-placeholder">
                                    <div className="bg-neutral text-neutral-content w-5 rounded-full">
                                        <span className="text-xs">{auth.user.username.charAt(0).toUpperCase()}</span>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <button onClick={handleLogout}>Logout</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;