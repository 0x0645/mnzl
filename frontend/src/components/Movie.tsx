import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/apiService';

interface MovieProps {
    _id: string;
    title: string;
    overview: string;
    releaseDate: string;
    posterPath: string;
    showAddToList?: boolean;
}

const Movie: React.FC<MovieProps> = ({ _id, title, overview, releaseDate, posterPath, showAddToList = true }) => {
    const { isAuthenticated } = useAuth();
    const [lists, setLists] = useState<{ _id: string; title: string }[]>([]);
    const [selectedList, setSelectedList] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await api.get('/user-lists/current/me');
                setLists(response.data);
                if (response.data.length > 0) {
                    setSelectedList(response.data[0]._id);
                }
            } catch (error) {
                console.error('Failed to fetch lists', error);
            }
        };

        if (isAuthenticated && showAddToList) {
            fetchLists();
        }
    }, [isAuthenticated, showAddToList]);

    const handleAddMovie = async () => {
        try {
            await api.post(`/user-lists/${selectedList}/movies`, { movieId: _id });
            setSuccessMessage('Movie added to the list successfully');
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage('Failed to add movie to the list');
            setSuccessMessage(null);
        }
    };

    return (
        <div className="flex mb-4 p-4 border-b border-gray-300 w-full">
            <img
                src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : '/path/to/default-image.jpg'}
                alt={title}
                className="w-20 h-32 object-cover rounded-lg mr-4"
            />
            <div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-sm text-gray-600">{new Date(releaseDate).getFullYear()}</p>
                <p className="text-sm mt-2">{overview}</p>
                {isAuthenticated && showAddToList && (
                    <div className="mt-4">
                        <select
                            value={selectedList}
                            onChange={(e) => setSelectedList(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                        >
                            {lists.map((list) => (
                                <option key={list._id} value={list._id}>
                                    {list.title}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddMovie}
                            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                        >
                            Add to List
                        </button>
                        {successMessage && <div className="text-green-500 mt-2">{successMessage}</div>}
                        {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Movie;
