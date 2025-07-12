export interface EncryptedData {
    data: string;
    iv: string;
    salt: string;
}
/**
 * Encrypts data with a password
 */
export declare function encrypt(data: Uint8Array, password: string): Promise<EncryptedData>;
/**
 * Decrypts data with a password
 */
export declare function decrypt(encrypted: EncryptedData, password: string): Promise<Uint8Array>;
