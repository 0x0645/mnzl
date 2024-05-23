import React, { useState } from 'react';
import api from '../api/apiService';
import { useAuth } from '../context/AuthContext';

const CreateList: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const { accessToken } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!accessToken) {
            setError('You must be logged in to create a list.');
            return;
        }

        try {
            await api.post('/user-lists', { title, description }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setSuccess(true);
            setTitle('');
            setDescription('');
        } catch (err) {
            setError('Failed to create the list. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Create a New List</h1>
            {error && <div className="bg-red-500 text-white p-4 mb-4 rounded">{error}</div>}
            {success && <div className="bg-green-500 text-white p-4 mb-4 rounded">List created successfully!</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 bg-gray-200 rounded-lg focus:outline-none"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        className="w-full px-3 py-2 bg-gray-200 rounded-lg focus:outline-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out">
                    Create List
                </button>
            </form>
        </div>
    );
};

export default CreateList;
