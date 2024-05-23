import { Request, Response, NextFunction } from 'express';
import log from '../utils/logger';

/**
 * Middleware to check if the user is authenticated.
 * This middleware assumes that user information has been
 * deserialized and stored in res.locals.user by a previous middleware.
 * 
 * If no user is found in res.locals.user, a 403 Forbidden response is sent.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
const requireUser = (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
        log.warn('Access denied: No user found in request');
        return res.status(403).json({ message: 'Forbidden: User not authenticated' });
    }

    log.info(`Access granted: User ${user.userId}`);
    return next();
};

export default requireUser;
