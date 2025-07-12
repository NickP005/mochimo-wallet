import { WOTSWallet } from 'mochimo-wots';

/**
 * Key derivation parameters
 */
export interface KDFParams {
    salt: Uint8Array;
    iterations?: number;
    keyLength?: number;
}
/**
 * Derives a key from a master seed and an index
 * @param masterSeed The master seed to derive from
 * @param index The derivation index
 * @param params Optional KDF parameters
 * @returns Promise<Uint8Array> The derived key
 */
export declare function deriveKey(masterSeed: Uint8Array, index: number, params: KDFParams): Promise<Uint8Array>;
/**
 * Derives a WOTS secret key from master seed and account index
 * @param masterSeed The master seed
 * @param accountIndex The account index
 * @returns Promise<Uint8Array> The derived WOTS secret key (32 bytes)
 */
export declare function deriveAccountSeed(masterSeed: Uint8Array, accountIndex: number): Promise<Uint8Array>;
/**
 * Derives a WOTS seed from an account seed and a WOTS index
 * @param accountSeed The account seed
 * @param wotsIndex The WOTS index
 * @returns Promise<Uint8Array> The derived WOTS seed (32 bytes)
 */
export declare function deriveWotsSeed(accountSeed: Uint8Array, wotsIndex: number): Promise<Uint8Array>;
/**
 * Derives an account tag from master seed and account index
 * Generates a 12-byte tag that will be alphanumeric when converted to hex
 */
export declare function deriveAccountTag(masterSeed: Uint8Array, accountIndex: number): Promise<Uint8Array>;
/**
 * Creates a WOTS wallet for a given account index
 * @param masterSeed The master seed
 * @param accountIndex The account index
 * @param name Optional wallet name
 * @returns Promise<WOTSWallet> The created WOTS wallet
 */
export declare function createWOTSWallet(masterSeed: Uint8Array, accountIndex: number, wotsIndex: number, name?: string): Promise<WOTSWallet>;
/**
 * Derives a key from a master seed and an index
 * @param masterSeed The master seed to derive from
 * @param index The derivation index
 * @param params Optional KDF parameters
 * @returns Promise<Uint8Array> The derived key
 */
export declare function deriveKeyCrypto(masterSeed: Uint8Array, index: number, params: KDFParams): Promise<Uint8Array>;
/**
 * Fast key derivation implementation
 */
export declare function deriveKeyFast(masterSeed: Uint8Array, index: number, params: KDFParams): Uint8Array;
