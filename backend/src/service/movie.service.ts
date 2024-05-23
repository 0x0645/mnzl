import axios from 'axios';
import config from 'config';

const apiKey = config.get<string>('movieDbAPIKey');
const baseUrl = 'https://api.themoviedb.org/3';

const movieDbClient = axios.create({
    baseURL: baseUrl,
    params: {
        api_key: apiKey,
    },
});

/**
 * Searches for movies based on the provided query using the MovieDB API.
 *
 * @param  query - The search query for movies.
 * @param  page - The page number to retrieve.
 * @return A promise that resolves to the search results data from the MovieDB API. If there is an error fetching the data, an empty object is returned.
 */
export async function searchMovies(query: string, page: number = 1) {
    try {
        const response = await movieDbClient.get('/search/movie', {
            params: {
                query,
                page,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from MovieDB API', error);
        return {};
    }
}

/**
 * Searches for movie details by movie ID using the MovieDB API.
 *
 * @param movieId - The ID of the movie to search for.
 * @return A promise that resolves to the movie details data from the MovieDB API, or null if there is an error.
 */
export async function searchMovieById(movieId: string) {
    try {
        const response = await movieDbClient.get(`/movie/${movieId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching movie details from MovieDB API', error);
        return null;
    }
}