import { Request, Response } from 'express';
import { CreateUserInput } from '../schema/user.schema';
import { createUser } from '../service/user.service';
import log from '../utils/logger';

/**
 * Handles the creation of a new user.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns Promise<Response>
 */
export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
): Promise<Response> {
  const body = req.body;

  try {
    const user = await createUser(body);

    return res.status(201).json({
      _id: user._id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      message: 'User created successfully',
    });
  } catch (e: any) {
    if (e.code === 11000) {
      log.error('Email already exists: ', e);
      return res.status(409).json({
        error: 'Email already exists',
      });
    }

    log.error('Error creating user: ', e);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: e.message,
    });
  }
}

/**
 * Retrieves the current authenticated user from the request context.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @returns Promise<Response>
 */
export async function getCurrentUserHandler(req: Request, res: Response): Promise<Response> {
  if (!res.locals.user) {
    log.warn('No user found in request context');
    return res.status(404).json({ error: 'User not found' });
  }

  return res.status(200).json(res.locals.user);
}
