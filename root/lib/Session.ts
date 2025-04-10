/**
 * @module SessionManagement
 * @description Provides utilities for managing user sessions using JWTs and server-side cookies.
 */

import { jwtVerify, SignJWT } from "jose";
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { api } from "@/root/apiHandler/ApiHandler";
import { Dict, SessionManager, SessionPayload } from "@/root/GTypes";

/**
 * @constant {string} SESSION_COOKIE_NAME
 * @description The name of the cookie used to store the session ID.
 */
const SESSION_COOKIE_NAME = 'sessionId';

/**
 * @constant {string | undefined} secretKey
 * @description The secret key used to sign and verify JWTs. This should be stored securely in environment variables.
 */
const secretKey = process.env.SESSION_SECRET;

/**
 * @constant {Uint8Array} encodedKey
 * @description The secret key encoded as a Uint8Array, required by the `jose` library.
 */
const encodedKey = new TextEncoder().encode(secretKey);

/**
 * @async
 * @function encrypt
 * @param {SessionPayload} payload - The payload to be encrypted and stored in the JWT.
 * @returns {Promise<string>} A promise that resolves to the signed JWT string.
 * @description Encrypts the provided payload into a JSON Web Token (JWT).
 * The JWT is signed using the HS256 algorithm and includes the issued at and expiration time claims.
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // Session expires in 7 days
        .sign(encodedKey);
}

/**
 * @async
 * @function decrypt
 * @param {string | undefined} [session=''] - The JWT string to decrypt. Defaults to an empty string.
 * @returns {Promise<object | undefined>} A promise that resolves to the decrypted payload object if the JWT is valid,
 * otherwise returns `undefined`.
 * @description Verifies and decrypts a JWT string. If the token is invalid or expired, it logs an error and returns `undefined`.
 */
export async function decrypt(session: string | undefined = ''): Promise<object | undefined> {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.log('Failed to verify session');
        return undefined;
    }
}

/**
 * @async
 * @function setSession
 * @template T
 * @param {string} key - The key under which to store the value in the session.
 * @param {T} value - The value to store in the session.
 * @returns {Promise<void | Response>} A promise that resolves when the value is successfully set in the session via the API,
 * or void if the session ID could not be retrieved.
 * @description Sets a specific key-value pair in the server-side session associated with the current session ID.
 * It retrieves the session ID from the cookies and then uses the `api.session.set` endpoint to store the data.
 */
async function setSession<T>(key: string, value: T): Promise<void> {
    const sessionId = await getSessionId();
    if (!sessionId) {
        return;
    }
    return await api.session.set(sessionId, key, value);
}

/**
 * @constant {SessionManager} Session
 * @description An object implementing the `SessionManager` interface, providing methods to interact with the server-side session.
 */
export const Session: SessionManager = {
    /**
     * @async
     * @method Session.set
     * @template T
     * @param {string} key - The key to store the value under.
     * @param {T} value - The value to store.
     * @returns {Promise<void | Response>} A promise that resolves when the value is successfully set.
     * @description Sets a value in the server-side session for the given key.
     */
    async set<T>(key: string, value: T): Promise<void> {
        return await setSession(key, value);
    },
    /**
     * @async
     * @method Session.get
     * @template T
     * @param {string} key - The key of the value to retrieve.
     * @param {T | null} [default_val=null] - The default value to return if the key is not found in the session.
     * @returns {Promise<T | null>} A promise that resolves to the retrieved value or the default value if not found.
     * @description Retrieves a value from the server-side session based on the provided key.
     */
    async get<T>(key: string, default_val: T | null = null): Promise<T | null> {
        const sessionId = await getSessionId();
        if (!sessionId) {
            return default_val;
        }
        return await api.session.get(sessionId, key, default_val);
    }
};

/**
 * @async
 * @function session
 * @template T
 * @param {string | Dict<T>} key - The key to get or an object containing key-value pairs to set.
 * If an object is provided, it will set multiple session values.
 * @param {T | null} [default_value=null] - The default value to return if the key is not found (only applicable when `key` is a string).
 * @returns {Promise<void | T | null | void[]>}
 * - If `key` is a string, returns a promise resolving to the session value or the `default_value`.
 * - If `key` is a dictionary, returns a promise resolving to an array of void promises (representing the completion of each set operation).
 * - Returns void if setting a single value and the session ID cannot be retrieved.
 * @description A versatile function to either get or set session values.
 * If a string `key` is provided, it retrieves the corresponding session value.
 * If an object `key` is provided, it sets multiple key-value pairs in the session.
 */
export default async function session<T>(
    key: string | Dict<T>,
    default_value: T | null = null
): Promise<void | T | null | void[]> {
    if (typeof key === "object" && !Array.isArray(key)) {
        const promises = Object.entries(key).map(async ([k, value]) =>
            await Session.set(k, value)
        );
        return Promise.all(promises);
    }
    return Session.get(key as string, default_value);
}

/**
 * @async
 * @function getSessionId
 * @returns {Promise<string | undefined>} A promise that resolves to the current session ID from the cookies,
 * or `undefined` if the cookie is not found.
 * @description Retrieves the session ID from the `sessionId` cookie.
 */
async function getSessionId(): Promise<string | undefined> {
    return (await cookies()).get(SESSION_COOKIE_NAME)?.value;
}

/**
 * @async
 * @function createSession
 * @param {string | undefined} [id] - An optional session ID to use. If not provided, a new UUID will be generated.
 * @returns {Promise<string>} A promise that resolves to the newly created or provided session ID.
 * @description Creates a new session on the server-side by calling the `api.session.init` endpoint with a unique session ID.
 * It generates a UUID if no ID is provided.
 */
async function createSession(id?: string): Promise<string> {
    const sessionId = id ? id : uuidv4();
    await api.session.init(sessionId);
    return sessionId;
}

export {
    getSessionId,
    createSession,
    SESSION_COOKIE_NAME,
};