import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Navbar: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 p-4 flex justify-between items-center">
            <div className="flex items-center">
                <img src={logo} alt="Logo" className="w-12 h-12 mr-2 object-contain" />
                <Link to="/" className="text-gray-400 hover:text-white font-semibold ml-4">Home</Link>
            </div>
            <ul className="flex space-x-6">
                <li><Link to="/movies" className="text-gray-400 hover:text-white font-semibold">Search</Link></li>
                <li><Link to="/lists" className="text-gray-400 hover:text-white font-semibold">List All</Link></li>
                {isAuthenticated && (
                    <li><Link to="/create-list" className="text-gray-400 hover:text-white font-semibold">Add List</Link></li>
                )}
            </ul>
            <div className="flex items-center">
                {isAuthenticated ? (
                    <>
                        <span className="text-white mr-4">Hello, {user?.firstName}!</span>
                        <button
                            onClick={handleLogout}
                            className="bg-gradient-to-r from-pink-500 to-pink-700 text-white font-bold py-2 px-4 rounded-full">
                            LOGOUT
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-gradient-to-r from-pink-500 to-pink-700 text-white font-bold py-2 px-4 rounded-full">
                        SIGN IN
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
