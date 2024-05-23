import { Request, Response } from 'express';
import axios from 'axios';
import config from 'config';
import log from '../utils/logger';

const apiKey = config.get<string>('movieDbAPIKey');
const baseUrl = 'https://image.tmdb.org/t/p';

/**
 * Handles the retrieval of an image from the MovieDB API.
 * The image path and size are specified in the request parameters and query respectively.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @returns Promise<void>
 */
export async function getImage(req: Request, res: Response): Promise<void> {
    const { path } = req.params;
    const { size = 'original' } = req.query;

    if (!path) {
        log.warn('Image path is required');
        res.status(400).json({ error: 'Image path is required' });
        return;
    }

    try {
        const response = await axios.get(`${baseUrl}/${size}/${path}`, {
            responseType: 'arraybuffer',
            params: {
                api_key: apiKey,
            },
        });

        res.set('Content-Type', response.headers['content-type']);
        res.set('Content-Length', response.headers['content-length']);
        res.send(response.data);
        log.info(`Image fetched successfully: ${path}`);
    } catch (error) {
        log.error(`Error fetching image from MovieDB API: ${(error as Error).message}`);
        res.status(500).json({ error: 'Failed to fetch image' });
    }
}
