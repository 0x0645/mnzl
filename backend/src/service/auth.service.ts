import { omit } from 'lodash';
import SessionModel from '../models/session.model';
import { User, privateFields } from '../models/user.model';
import { signJwt } from '../utils/jwt';
import { DocumentType } from "@typegoose/typegoose";
import log from '../utils/logger';

/**
 * Creates a new session for the given user.
 * @param userId - The ID of the user.
 * @returns The created session.
 */
export async function createSession({ userId }: { userId: string }) {
    try {
        const session = await SessionModel.create({ user: userId });
        log.info(`Session created for user ${userId}`);
        return session;
    } catch (error) {
        log.error(`Failed to create session for user ${userId}: ${error}`);
        throw new Error('Failed to create session');
    }
}

/**
 * Finds a session by its ID.
 * @param id - The ID of the session.
 * @returns The session, if found.
 */
export async function findSessionById(id: string) {
    try {
        const session = await SessionModel.findById(id);
        if (!session) {
            log.warn(`Session with id ${id} not found`);
            throw new Error('Session not found');
        }
        return session;
    } catch (error) {
        log.error(`Failed to find session with id ${id}: ${error}`);
        throw new Error('Failed to find session');
    }
}

/**
 * Signs a refresh token for the given user.
 * @param userId - The ID of the user.
 * @returns The signed refresh token.
 */
export async function signRefreshToken({ userId }: { userId: string }) {
    try {
        const session = await createSession({ userId });

        const refreshToken = signJwt(
            {
                session: session._id,
            },
            'refreshTokenPrivateKey',
            {
                expiresIn: '1y',
            }
        );

        log.info(`Refresh token signed for user ${userId}`);
        return refreshToken;
    } catch (error) {
        log.error(`Failed to sign refresh token for user ${userId}: ${error}`);
        throw new Error('Failed to sign refresh token');
    }
}
/**
 * Signs an access token for the given user.
 *
 * @param  user - The user for whom the access token is being generated.
 * @return  The signed access token.
 */
export function signAccessToken(user: DocumentType<User>) {
    const payload = omit(user.toJSON(), privateFields);

    const accessToken = signJwt(payload, "accessTokenPrivateKey", {
        expiresIn: "15m",
    });

    return accessToken;
}