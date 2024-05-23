import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo.png';

const LoginForm: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Login failed. Please check your email and password.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: `url('/path/to/your/background.jpg')` }}>
            <div className="absolute inset-0 bg-black opacity-90"></div>
            <div className="bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md relative z-10">
                <img src={logo} alt="Logo" className="w-32 mx-auto mb-8" />
                {error && <div className="bg-red-500 text-white p-4 mb-4 rounded">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-700 transition duration-150 ease-in-out">LOGIN</button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-200">Don't have an account? <a href="/signup" className="text-pink-500 hover:underline">Sign up!</a></p>
            </div>
        </div>
    );
};

export default LoginForm;
