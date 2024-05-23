import { Request, Response } from 'express';
import UserListModel from '../models/userList.model';
import MovieModel from '../models/movie.model';
import { searchMovieById } from '../service/movie.service';

export async function createUserList(req: Request, res: Response) {
    const { title, description } = req.body;
    const userId = res.locals.user._id;

    if (!title) {
        return res.status(400).send({ error: 'Title is required' });
    }
    if (!description) {
        return res.status(400).send({ error: 'Description is required' });
    }
    try {
        const newUserList = await UserListModel.create({ userId, title, description });
        res.status(201).send(newUserList);
    } catch (error) {
        res.status(500).send({ error: 'Failed to create user list' });
    }
}
export async function getAllUserLists(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    try {
        const userLists = await UserListModel.find()
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .populate({
                path: 'userId',
                select: 'firstName lastName'
            })
            .populate('movies');

        const totalUserLists = await UserListModel.countDocuments();

        res.send({
            data: userLists,
            total: totalUserLists,
            page: pageNumber,
            totalPages: Math.ceil(totalUserLists / limitNumber),
        });
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch user lists' });
    }
}

export async function getUserLists(req: Request, res: Response) {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    try {
        const userLists = await UserListModel.find({ userId })
            .sort({ createdAt: -1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .populate({
                path: 'userId',
                select: 'firstName lastName'
            })
            .populate('movies');

        const totalUserLists = await UserListModel.countDocuments({ userId });

        res.send({
            data: userLists,
            total: totalUserLists,
            page: pageNumber,
            totalPages: Math.ceil(totalUserLists / limitNumber),
        });
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch user lists' });
    }
}
export async function removeMovieFromList(req: Request, res: Response) {
    const { listId } = req.params;
    const { movieId } = req.body;
    const userId = res.locals.user._id;

    if (!movieId) {
        return res.status(400).send({ error: 'Movie ID is required' });
    }

    try {
        const userList = await UserListModel.findOne({ _id: listId, userId });
        if (!userList) {
            return res.status(404).send({ error: 'User list not found' });
        }

        userList.movies = userList.movies.filter(m => m.toString() !== movieId);
        await userList.save();
        res.send(userList);
    } catch (error) {
        console.error('Error removing movie from list', error);
        res.status(500).send({ error: 'Failed to remove movie from list' });
    }
}

export async function deleteUserList(req: Request, res: Response) {
    const { listId } = req.params;
    const userId = res.locals.user._id;

    try {
        const userList = await UserListModel.findOneAndDelete({ _id: listId, userId });
        if (!userList) {
            return res.status(404).send({ error: 'User list not found' });
        }
        res.send({ message: 'User list deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete user list' });
    }
}

/**
 * Updates a user list.
 *
 * @param  req - The request object containing the list ID and the updated title or description.
 * @param  res - The response object used to send the result of the operation.
 * @return  A promise that resolves when the user list title is updated successfully, or rejects with an error.
 */
export async function updateUserList(req: Request, res: Response) {
    const { listId } = req.params;
    const { title, description } = req.body;
    const userId = res.locals.user._id;
    if (!title && !description) {
        return res.status(400).send({ error: 'title or description are required' });
    }

    try {
        const userList = await UserListModel.findOneAndUpdate({ _id: listId, userId }, { title, description }, { new: true });
        if (!userList) {
            return res.status(404).send({ error: 'User list not found' });
        }
        res.send(userList);
    } catch (error) {
        res.status(500).send({ error: 'Failed to update user list title' });
    }
}

/**
 * Adds a movie to a user list.
 *
 * @param  req - The request object containing the list ID and movie ID.
 * @param  res - The response object used to send the result of the operation.
 * @return A promise that resolves when the movie is added to the user list, or rejects with an error.
 */
export async function addMovieToList(req: Request, res: Response) {
    const { listId } = req.params;
    const { movieId } = req.body;
    if (!movieId) {
        return res.status(400).send({ error: 'Movie ID is required' });
    }
    const userId = res.locals.user._id;

    try {
        const userList = await UserListModel.findOne({ _id: listId, userId });
        if (!userList) {
            return res.status(404).send({ error: 'User list not found' });
        }

        let movie = await MovieModel.findOne({ movieId });
        if (!movie) {
            const movieDetails = await searchMovieById(movieId);
            if (!movieDetails) {
                return res.status(404).send({ error: 'Movie not found' });
            }

            movie = new MovieModel({
                movieId,
                title: movieDetails.title,
                overview: movieDetails.overview,
                releaseDate: movieDetails.release_date,
                posterPath: movieDetails.poster_path,
            });
            await movie.save();
        }

        if (!userList.movies.includes(movie._id)) {
            userList.movies.push(movie._id);
            await userList.save();
        }

        res.send(userList);
    } catch (error) {
        console.error('Error adding movie to list', error);
        res.status(500).send({ error: 'Failed to add movie to list' });
    }
}


/**
 * Retrieves data for a single user list by its ID.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns Promise<Response>
 */
export async function getUserListById(req: Request, res: Response): Promise<Response> {
    const { listId } = req.params;

    try {
        const userList = await UserListModel.findById(listId).populate({
            path: 'userId',
            select: 'firstName lastName'
        }).populate('movies');

        if (!userList) {
            return res.status(404).json({ error: 'User list not found' });
        }
        
        return res.status(200).json(userList);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch user list' });
    }
}

/**
 * Retrieves all lists for the authenticated user without pagination,
 * only returning the ID and title.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns Promise<void>
 */
export async function getCurrentUserLists(req: Request, res: Response): Promise<void> {
    const userId = res.locals.user._id;

    try {
        const userLists = await UserListModel.find({ userId }).select('id title');

        res.status(200).json(userLists);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch current user lists' });
    }
}