/**
 * Generates cryptographically secure random bytes
 * @param length Number of bytes to generate
 * @returns Uint8Array of random bytes
 */
export declare function getRandomBytes(length: number): Uint8Array;
/**
 * Generates a random seed of specified length
 * @param length Length of the seed in bytes (default: 32)
 * @returns Uint8Array containing the random seed
 */
export declare function generateSeed(length?: number): Uint8Array;
/**
 * Securely wipes a Uint8Array by overwriting with zeros
 * @param data Uint8Array to wipe
 */
export declare function wipeBytes(data: Uint8Array): void;
/**
 * Generates a random value within a range
 * @param min Minimum value (inclusive)
 * @param max Maximum value (exclusive)
 * @returns Random number within the specified range
 */
export declare function getRandomRange(min: number, max: number): number;
