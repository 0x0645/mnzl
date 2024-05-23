import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Movie {
    _id: string;
    movieId: string;
    title: string;
    overview: string;
    releaseDate: string;
    posterPath: string;
    __v: number;
}

interface UserListProps {
    listId: string;
    userId: string;
    title: string;
    description: string;
    color: string;
    userName: string;
    numberOfFilms: number;
    movies: Movie[];
}

const UserList: React.FC<UserListProps> = ({ listId, userId, title, description, userName, numberOfFilms, movies }) => {
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col">
            <div className="flex mb-4 space-x-2">
                {movies.length > 0 ? (
                    movies.slice(0, 4).map(movie => (
                        <div key={movie._id} className="w-1/4 h-32">
                            <img
                                src={movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : '/path/to/default-image.jpg'}
                                alt={movie.title}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    ))
                ) : (
                    <div className="w-full h-32 flex items-center justify-center rounded-lg bg-gray-300">
                        <span className="text-3xl">😞</span>
                    </div>
                )}
            </div>
            <h3 className="text-lg font-bold text-gray-900">
                <Link to={`/list/${listId}`} className="text-blue-500 hover:underline">
                    {title}
                </Link>
            </h3>
            <p className="text-sm text-gray-600">
                by{' '}
                <Link to={`/userlists/${userId}`} className="text-blue-500 hover:underline">
                    {userName}
                </Link>
            </p>
            <p className="text-gray-700 mt-2 mb-4">
                {showMore ? description : `${description.substring(0, 100)}...`}
                {description.length > 100 && (
                    <span
                        onClick={toggleShowMore}
                        className="text-blue-500 cursor-pointer ml-2"
                    >
                        {showMore ? 'Show less' : 'Show more'}
                    </span>
                )}
            </p>
            <div className="text-sm text-gray-600">
                <span>FILMS {numberOfFilms}</span>
            </div>
        </div>
    );
};

export default UserList;
