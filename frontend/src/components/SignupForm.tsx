import React, { useState } from 'react';
import axios from 'axios';
import api from '../api/apiService';

import image from '../assets/images/home.jpg';
import logo from '../assets/images/logo.png';

const SignupForm: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const response = await api.post('/users', {
                firstName,
                lastName,
                email,
                password,
                passwordConfirmation
            });
            if (response.status === 201) {
                setMessage('Signup successful! You can now log in.');
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setPasswordConfirmation('');
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Signup failed. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover relative" style={{ backgroundImage: `url(${image})` }}>
            <div className="absolute inset-0 bg-black opacity-90"></div>
            <div className="bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md relative z-10">
                <img src={logo} alt="Logo" className="w-32 h-32 mx-auto mb-4" />
                {message && <div className="bg-green-500 text-white p-4 mb-4 rounded">{message}</div>}
                {error && <div className="bg-red-500 text-white p-4 mb-4 rounded">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                    <div>
                        <label className="block text-sm font-medium text-gray-200">First Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Last Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="new-password"
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
                            autoComplete="new-password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" className="form-checkbox h-4 w-4 text-pink-600 transition duration-150 ease-in-out" required />
                        <label className="ml-2 text-sm text-gray-200">
                            I agree to the <a href="#privacy" className="text-pink-500 hover:underline">Privacy Policy</a>
                        </label>
                    </div>
                    <button type="submit" className="w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-700 transition duration-150 ease-in-out">SIGN UP</button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-200">Already have an account? <a href="/login" className="text-pink-500 hover:underline">Sign in!</a></p>
            </div>
        </div>
    );
};

export default SignupForm;
