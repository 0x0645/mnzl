import React from 'react';
import { Link } from 'react-router-dom';

const MovieCards: React.FC = () => {
    return (
        <section className="bg-gray-900 py-10">
            <div className="container-xl lg:container m-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-white">Show All Movies</h2>
                        <p className="mt-2 mb-4 text-gray-300">
                            Browse all movies listed by users.
                        </p>
                        <Link
                            to="/lists"
                            className="inline-block bg-pink-500 text-white rounded-lg px-4 py-2 hover:bg-pink-700"
                        >
                            Browse All Movies
                        </Link>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-white">Search for a Movie</h2>
                        <p className="mt-2 mb-4 text-gray-300">
                            Find the perfect movie for your taste.
                        </p>
                        <Link
                            to="/movies"
                            className="inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-700"
                        >
                            Search Movies
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MovieCards;
