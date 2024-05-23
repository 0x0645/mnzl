import React, { useState } from 'react';
import api from '../api/apiService';
import Movie from './Movie';
import { useAuth } from '../context/AuthContext';

interface MovieData {
    id: string;
    title: string;
    overview: string;
    release_date: string;
    poster_path: string;
}

interface ApiResponse {
    page: number;
    results: MovieData[];
    total_pages: number;
    total_results: number;
}

const MovieSearch: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [query, setQuery] = useState<string>('');
    const [movies, setMovies] = useState<MovieData[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMovies = async (query: string, page: number) => {
        try {
            setLoading(true);
            const response = await api.get<ApiResponse>(`/movies?title=${query}&page=${page}`);
            if (page === 1) {
                setMovies(response.data.results);
            } else {
                setMovies((prevMovies) => [...prevMovies, ...response.data.results]);
            }
            setTotalPages(response.data.total_pages);
            setError(null);
        } catch (err) {
            setError('Failed to fetch movies. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setPage(1);
            fetchMovies(query, 1);
        }
    };

    const handleLoadMore = () => {
        if (page < totalPages) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchMovies(query, nextPage);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Search Movies</h1>
            <form onSubmit={handleSearch} className="mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for movies..."
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out">
                    Search
                </button>
            </form>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="space-y-4">
                {movies.map((movie) => (
                    <Movie
                        key={movie.id}
                        _id={movie.id}
                        title={movie.title}
                        overview={movie.overview}
                        releaseDate={movie.release_date}
                        posterPath={movie.poster_path}
                        showAddToList={isAuthenticated}
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

export default MovieSearch;
