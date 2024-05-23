import { Request, Response } from 'express';
import { get } from 'lodash';
import { CreateSessionInput } from '../schema/auth.schema';
import { findUserByEmail, findUserById } from '../service/user.service';
import { verifyJwt } from '../utils/jwt';
import { signRefreshToken, findSessionById, signAccessToken } from '../service/auth.service';
import log from '../utils/logger';

/**
 * Handles the creation of a user session.
 * @param req - Express request object
 * @param res - Express response object
 */
export async function createSessionHandler(
    req: Request<{}, {}, CreateSessionInput>,
    res: Response
) {
    const message = 'Invalid email or password';
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            log.warn(`Authentication failed for email: ${email}`);
            return res.status(401).json({ message });
        }

        const isValid = await user.validatePassword(password);

        if (!isValid) {
            log.warn(`Invalid password for email: ${email}`);
            return res.status(401).json({ message });
        }

        const accessToken = signAccessToken(user);

        const refreshToken = await signRefreshToken({ userId: user._id.toString() });

        log.info(`Session created for user: ${email}`);
        return res.status(200).json({
            accessToken,
            refreshToken,
        });
    } catch (error) {
        log.error(`Error creating session: ${(error as Error).message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * Handles the refreshing of an access token using a refresh token.
 * @param req - Express request object
 * @param res - Express response object
 */
export async function refreshAccessTokenHandler(req: Request, res: Response) {
    const refreshToken = get(req, 'headers.x-refresh');

    if (!refreshToken || typeof refreshToken !== 'string') {
        log.warn('Refresh token is missing or invalid');
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        const decoded = verifyJwt<{ session: string }>(refreshToken, 'refreshTokenPublicKey');

        if (!decoded) {
            log.warn('Invalid refresh token');
            return res.status(401).json({ message: 'Could not refresh access token' });
        }

        const session = await findSessionById(decoded.session);

        if (!session || !session.valid) {
            log.warn(`Session invalid or not found: ${decoded.session}`);
            return res.status(401).json({ message: 'Could not refresh access token' });
        }

        const user = await findUserById(String(session.user));

        if (!user) {
            log.warn(`User not found for session: ${decoded.session}`);
            return res.status(401).json({ message: 'Could not refresh access token' });
        }

        const accessToken = signAccessToken(user);
        log.info(`Access token refreshed for user: ${user.email}`);

        return res.status(200).json({ accessToken });
    } catch (error) {
        log.error(`Error refreshing access token: ${(error as Error).message}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
