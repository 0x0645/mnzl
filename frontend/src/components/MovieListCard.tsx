import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/apiService';
import UserList from './UserList';

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

interface UserListData {
    description: string;
    _id: string;
    userId: User;
    title: string;
    movies: Movie[];
    __v: number;
    createdAt?: string;
    updatedAt?: string;
}

interface ApiResponse {
    data: UserListData[];
    total: number;
    page: number;
    totalPages: number;
}

const getRandomColor = () => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    return colors[Math.floor(Math.random() * colors.length)];
};

const MovieListCard: React.FC = () => {
    const [lists, setLists] = useState<UserListData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await api.get<ApiResponse>('/user-lists/');
                const latestLists = response.data.data.slice(0, 3);
                setLists(latestLists);
            } catch (error) {
                setError('Error fetching data');
                console.error('Error fetching data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="bg-gray-900 py-10">
            <div className="container-xl lg:container m-auto">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Latest User Lists</h2>
                {loading ? (
                    <div className="text-center text-white">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : lists.length === 0 ? (
                    <div className="text-center text-gray-500">No lists found.</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg">
                            {lists.map((list, index) => (
                                <UserList
                                    key={`${list._id}-${index}`}
                                    listId={list._id}
                                    userId={list.userId._id}
                                    title={list.title}
                                    description={list.description || 'No description available'}
                                    color={getRandomColor()}
                                    userName={`${list.userId.firstName} ${list.userId.lastName}`}
                                    numberOfFilms={list.movies.length}
                                    movies={list.movies}
                                />
                            ))}
                        </div>
                        <div className="text-center mt-6">
                            <Link
                                to="/lists"
                                className="inline-block bg-pink-500 text-white rounded-lg px-4 py-2 hover:bg-pink-700"
                            >
                                See More
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default MovieListCard;
