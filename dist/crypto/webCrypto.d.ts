/**
 * Web Crypto API wrapper for cryptographic operations
 */
export interface EncryptedData {
    data: string;
    iv: string;
    salt: string;
    tag?: string;
}
/**
 * Encrypts data using AES-CBC
 */
export declare function encrypt(data: Uint8Array, password: string): Promise<EncryptedData>;
/**
 * Decrypts AES-CBC encrypted data
 */
export declare function decrypt(encrypted: EncryptedData, password: string): Promise<Uint8Array>;
/**
 * Generates a random key
 */
export declare function generateRandomKey(length?: number): Uint8Array;
/**
 * Derives a deterministic key from a master key and index
 */
export declare function deriveSubkey(masterKey: Uint8Array, index: number): Promise<Uint8Array>;
