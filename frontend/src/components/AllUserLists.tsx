import React, { useState, useEffect } from 'react';
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
    _id: string;
    userId: User;
    title: string;
    description: string;
    movies: Movie[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ApiResponse {
    data: UserListData[];
    total: number;
    page: number;
    totalPages: number;
}

const AllUserLists: React.FC = () => {
    const [lists, setLists] = useState<UserListData[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllUserLists = async (page: number) => {
        try {
            setLoading(true);
            const response = await api.get<ApiResponse>(`/user-lists?page=${page}`);
            setLists(prevLists => {
                const newListIds = response.data.data.map(list => list._id);
                const filteredPrevLists = prevLists.filter(list => !newListIds.includes(list._id));
                return [...filteredPrevLists, ...response.data.data];
            });
            setTotalPages(response.data.totalPages);
            setError(null);
        } catch (err) {
            setError('Failed to fetch user lists.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUserLists(page);
    }, [page]);

    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    if (loading && page === 1) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loader">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">All User Lists</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="grid grid-cols-1 gap-4">
                {lists.length === 0 && !loading && <div className="text-gray-500">No lists found.</div>}
                {lists.map((list) => (
                    <UserList
                        key={list._id}
                        listId={list._id}
                        userId={list.userId._id}
                        title={list.title}
                        description={list.description || 'No description available'}
                        color="bg-blue-500"
                        userName={`${list.userId.firstName} ${list.userId.lastName}`}
                        numberOfFilms={list.movies.length}
                        movies={list.movies}
                    />
                ))}
            </div>
            {loading && <div className="text-center my-4">Loading...</div>}
            {page < totalPages && !loading && (
                <div className="text-center my-4">
                    <button
                        onClick={handleLoadMore}
                        className="bg-pink-500 text-white rounded-lg px-4 py-2 hover:bg-pink-700"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllUserLists;
