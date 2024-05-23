import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
import log from '../utils/logger';

/**
 * Interface representing the payload of a JWT.
 */
interface UserPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}

/**
 * Middleware to deserialize a user from a JWT in the Authorization header.
 * If the token is valid, the user information is attached to res.locals.user.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '');

    if (!accessToken) {
        return next();
    }

    try {
        const decoded = verifyJwt<UserPayload>(accessToken, 'accessTokenPublicKey');

        if (decoded) {
            res.locals.user = decoded;
            log.info(`User deserialized: ${decoded.userId}`);
        } else {
            log.warn('Failed to deserialize user: invalid token');
        }
    } catch (error) {
        if (error instanceof Error) {
            log.error(`Error deserializing user: ${error.message}`);
        } else {
            log.error('Unknown error deserializing user');
        }
    }

    return next();
};

export default deserializeUser;
