import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/apiService';
import Movie from './Movie';
import { useAuth } from '../context/AuthContext';

interface Movie {
    _id: string;
    movieId: string;
    title: string;
    overview: string;
    releaseDate: string;
    posterPath: string;
    __v: number;
}

interface User {
    _id: string;
    firstName: string;
    lastName: string;
}

interface UserList {
    _id: string;
    userId: User;
    title: string;
    description: string;
    movies: Movie[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

const ListDetails: React.FC = () => {
    const { listId } = useParams<{ listId: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [list, setList] = useState<UserList | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchList = async () => {
            try {
                setLoading(true);
                const response = await api.get<UserList>(`/user-lists/list/${listId}`);
                setList(response.data);
                setTitle(response.data.title);
                setDescription(response.data.description);
                setError(null);
            } catch (err) {
                setError('Failed to fetch list details.');
                setList(null);
            } finally {
                setLoading(false);
            }
        };

        fetchList();
    }, [listId]);

    const handleSave = async () => {
        try {
            const updateData: Partial<UserList> = {};
            if (title !== list?.title) {
                updateData.title = title;
            }
            if (description !== list?.description) {
                updateData.description = description;
            }
            await api.put(`/user-lists/${listId}`, updateData);
            if (list) {
                setList({ ...list, ...updateData });
            }
            setSuccessMessage('List updated successfully.');
            setEditing(false);
        } catch (err) {
            setError('Failed to update list details.');
        }
    };

    const handleRemoveMovie = async (movieId: string) => {
        try {
            await api.delete(`/user-lists/${listId}/movies`, { data: { movieId } });
            setList(prevList => prevList ? {
                ...prevList,
                movies: prevList.movies.filter(movie => movie._id !== movieId)
            } : null);
        } catch (err) {
            setError('Failed to remove movie from list.');
        }
    };

    const handleDeleteList = async () => {
        try {
            await api.delete(`/user-lists/${listId}`);
            navigate('/lists');
        } catch (err) {
            setError('Failed to delete list.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loader">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!list) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">List not found.</div>
            </div>
        );
    }

    const isOwner = user?._id === list.userId._id;

    return (
        <div className="container mx-auto p-4">
            {isOwner && editing ? (
                <>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 mb-4 border rounded"
                    />
                    <div className="flex space-x-4">
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                    {successMessage && <div className="text-green-500 mt-2">{successMessage}</div>}
                </>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-4">{list.title}</h1>
                    <p className="text-gray-600">by {list.userId.firstName} {list.userId.lastName}</p>
                    <p className="mt-2 mb-6">{list.description}</p>
                    {isOwner && (
                        <div className="flex space-x-4 mb-4">
                            <button
                                onClick={() => setEditing(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDeleteList}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                            >
                                Delete List
                            </button>
                        </div>
                    )}
                </>
            )}
            <h2 className="text-2xl font-bold mt-6 mb-4">Movies</h2>
            <div>
                {list.movies.map((movie, index) => (
                    <div key={movie._id} className="flex items-start mb-4">
                        <div className="text-lg font-bold mr-4">{index + 1}.</div>
                        <Movie
                            _id={movie._id}
                            title={movie.title}
                            overview={movie.overview}
                            releaseDate={movie.releaseDate}
                            posterPath={movie.posterPath}
                            showAddToList={false}
                        />
                        {isOwner && (
                            <button
                                onClick={() => handleRemoveMovie(movie._id)}
                                className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListDetails;
