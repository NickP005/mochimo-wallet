/**
 * SHA256 hash function
 * @param data Input data as Uint8Array
 * @returns Hash as Uint8Array
 */
export declare function sha256(data: Uint8Array): Uint8Array;
/**
 * HMAC-SHA256
 * @param key Key as Uint8Array
 * @param data Data to hash as Uint8Array
 * @returns HMAC as Uint8Array
 */
export declare function hmacSHA256(key: Uint8Array, data: Uint8Array): Uint8Array;
