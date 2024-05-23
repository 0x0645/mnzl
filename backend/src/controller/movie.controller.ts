import { Request, Response } from 'express';
import { searchMovies } from '../service/movie.service';
import log from '../utils/logger';

/**
 * Handles the retrieval of movies based on a search title and optional page number.
 * The title is specified as a query parameter, and the page number is optional.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns Promise<void>
 */
export async function getMovies(req: Request, res: Response): Promise<void> {
    const { title, page } = req.query;

    if (!title) {
        log.warn('Title query parameter is required');
        res.status(400).json({ error: 'Title query parameter is required' });
        return;
    }

    const pageNumber = parseInt(page as string, 10) || 1;

    try {
        const movies = await searchMovies(title as string, pageNumber);
        res.status(200).json(movies);
        log.info(`Movies fetched successfully for title: ${title}, page: ${pageNumber}`);
    } catch (error) {
        log.error(`Failed to fetch movies: ${(error as Error).message}`);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
}
