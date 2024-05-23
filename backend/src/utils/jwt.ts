import jwt from 'jsonwebtoken';
import config from 'config';
import log from './logger';

/**
 * Signs a JWT.
 * @param payload - The payload to sign.
 * @param keyName - The name of the key to use from the config.
 * @param options - JWT signing options.
 * @returns The signed JWT.
 */
export function signJwt(
  payload: object,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: jwt.SignOptions
): string {
  const signingKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii');

  try {
    return jwt.sign(payload, signingKey, {
      ...(options && options),
      algorithm: 'RS256',
      allowInsecureKeySizes: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      log.error(`Failed to sign JWT: ${error.message}`);
    } else {
      log.error('Failed to sign JWT: unknown error');
    }
    throw new Error('Failed to sign JWT');
  }
}

/**
 * Verifies a JWT.
 * @param token - The JWT to verify.
 * @param keyName - The name of the key to use from the config.
 * @returns The decoded token or null if verification fails.
 */
export function verifyJwt<T>(
  token: string,
  keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
): T | null {
  const publicKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii');

  try {
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (error) {
    if (error instanceof Error) {
      log.warn(`Failed to verify JWT: ${error.message}`);
    } else {
      log.warn('Failed to verify JWT: unknown error');
    }
    return null;
  }
}
