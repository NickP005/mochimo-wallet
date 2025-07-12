import { EncryptedData } from '../crypto/webCrypto';

export interface EncryptedSeed {
    data: string;
    iv: string;
    salt: string;
}
export declare class MasterSeed {
    private seed?;
    private entropy?;
    private _isLocked;
    constructor(seed: Uint8Array, entropy?: Uint8Array);
    /**
     * Creates a new master seed with random entropy
     */
    static create(): Promise<MasterSeed>;
    /**
     * Creates a master seed from a BIP39 mnemonic phrase
     */
    static fromPhrase(phrase: string): Promise<MasterSeed>;
    /**
     * Exports the seed phrase for this master seed
     */
    toPhrase(): Promise<string>;
    /**
     * Locks the master seed by wiping it from memory
     */
    lock(): void;
    /**
     * Checks if the master seed is locked
     */
    get isLocked(): boolean;
    deriveAccount(accountIndex: number): {
        tag: string;
        seed: Uint8Array;
        wotsSeed: Uint8Array;
        address: Uint8Array;
    };
    /**
     * Derives an account seed for the given index
     * @throws Error if the master seed is locked
     */
    deriveAccountSeed(accountIndex: number): Uint8Array;
    /**
     * Derives an account tag for the given index
     * @throws Error if the master seed is locked
     */
    deriveAccountTag(accountIndex: number): Promise<Uint8Array>;
    static deriveWotsIndexFromWotsAddrHash(accountSeed: Uint8Array, wotsAddrHash: Uint8Array, firstWotsAddress: Uint8Array, startIndex?: number, endIndex?: number): number;
    /**
     * Exports the master seed in encrypted form
     */
    export(password: string): Promise<EncryptedData>;
    static deriveKey(encrypted: EncryptedData, password: string): Promise<CryptoKey>;
    /**
     * Creates a MasterSeed instance from an encrypted seed
     */
    static import(encrypted: EncryptedData, password: string): Promise<MasterSeed>;
    static importFromDerivedKey(encrypted: EncryptedData, derivedKey: CryptoKey): Promise<MasterSeed>;
    static importFromDerivedKeyJWK(encrypted: EncryptedData, derivedKey: JsonWebKey): Promise<MasterSeed>;
    /**
     * Derives a storage key from the master seed using HKDF-like construction
     * Returns a 32-byte key suitable for AES-256
     */
    deriveStorageKey(): Uint8Array;
    /**
     * Derives a storage key using native Web Crypto API
     */
    deriveStorageKeyNative(): Promise<Uint8Array>;
}
