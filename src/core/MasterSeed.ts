import { generateSeed, wipeBytes } from '../crypto/random';

import { WOTS, WotsAddress, WOTSWallet } from 'mochimo-wots';
import { EncryptedData } from '../crypto/webCrypto';

import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { Derivation } from '../redux/utils/derivation';
import CryptoJS from 'crypto-js';


const PBKDF2_ITERATIONS = process.env.NODE_ENV === 'test' ? 1000 : 100000;

export interface EncryptedSeed {
    data: string;      // Base64 encrypted seed
    iv: string;        // Initialization vector
    salt: string;      // Salt for key derivation
}

export class MasterSeed {
    private seed?: Uint8Array;
    private entropy?: Uint8Array;  // Store original entropy for phrase generation
    private _isLocked: boolean = true;

    public constructor(seed: Uint8Array, entropy?: Uint8Array) {
        this.seed = seed;
        this.entropy = entropy;
        this._isLocked = false;
    }

    /**
     * Creates a new master seed with random entropy
     */
    static async create(): Promise<MasterSeed> {
        const seed = generateSeed();
        return new MasterSeed(seed);
    }


    /**
     * Creates a master seed from a BIP39 mnemonic phrase
     */
    static async fromPhrase(phrase: string): Promise<MasterSeed> {
        try {
            // First validate the phrase
            const isValid = bip39.validateMnemonic(phrase, wordlist);
            if (!isValid) {
                throw new Error('Invalid seed phrase');
            }

            // Convert phrase to entropy first
            const entropy = bip39.mnemonicToEntropy(phrase, wordlist);

            // Then convert to seed
            const seed = await bip39.mnemonicToSeed(phrase);
            const masterSeed = new Uint8Array(seed.slice(0, 32));

            // Store both seed and original entropy
            return new MasterSeed(masterSeed, entropy);
        } catch (error) {
            if (error instanceof Error && error.message === 'Invalid seed phrase') {
                throw error;
            }
            console.error('Seed phrase error:', error);
            throw new Error('Failed to create master seed from phrase');
        }
    }

    /**
     * Exports the seed phrase for this master seed
     */
    async toPhrase(): Promise<string> {
        if (!this.seed) {
            throw new Error('Master seed is locked / does not exist');
        }

        try {
            // If we have original entropy, use it
            if (this.entropy) {
                return bip39.entropyToMnemonic(this.entropy, wordlist);
            }

            // Otherwise generate new entropy from seed
            const entropy = new Uint8Array(32);
            entropy.set(this.seed);
            return bip39.entropyToMnemonic(entropy, wordlist);
        } catch (error) {
            console.error('Phrase generation error:', error);
            throw new Error('Failed to generate seed phrase');
        }
    }

    /**
     * Locks the master seed by wiping it from memory
     */
    lock(): void {
        if (this.seed) {
            wipeBytes(this.seed);
            this.seed = undefined;
        }
        if (this.entropy) {
            wipeBytes(this.entropy);
            this.entropy = undefined;
        }
        this._isLocked = true;
    }

    /**
     * Checks if the master seed is locked
     */
    get isLocked(): boolean {
        return this._isLocked;
    }

    deriveAccount(accountIndex: number): { tag: string, seed: Uint8Array, wotsSeed: Uint8Array, address: Uint8Array } {
        if (this._isLocked || !this.seed) {
            throw new Error('Master seed is locked');
        }

        const tag = Derivation.deriveAccountTag(this.seed, accountIndex);
        const { secret: accountSeed, prng } = Derivation.deriveSeed(this.seed, accountIndex);
        //generate first address/public key
        const address = WOTS.generateRandomAddress(new Uint8Array(12).fill(1), accountSeed, (bytes) => {
            if (prng) {
                const len = bytes.length;
                const randomBytes = prng.nextBytes(len);
                bytes.set(randomBytes);
            }
        });

        return {
            tag: Buffer.from(tag).toString('hex'),
            seed: accountSeed,
            wotsSeed: accountSeed,
            address: address
        };
    }

    /**
     * Derives an account seed for the given index
     * @throws Error if the master seed is locked
     */
    deriveAccountSeed(accountIndex: number): Uint8Array {
        if (this._isLocked || !this.seed) {
            throw new Error('Master seed is locked');
        }
        return Derivation.deriveSeed(this.seed, accountIndex).secret;
    }

    /**
     * Derives an account tag for the given index
     * @throws Error if the master seed is locked
     */
    async deriveAccountTag(accountIndex: number): Promise<Uint8Array> {
        if (this._isLocked || !this.seed) {
            throw new Error('Master seed is locked');
        }
        return Derivation.deriveAccountTag(this.seed, accountIndex);
    }

    public static deriveWotsIndexFromWotsAddrHash(accountSeed: Uint8Array, wotsAddrHash: Uint8Array, firstWotsAddress: Uint8Array, startIndex: number = 0, endIndex: number = 10000): number {
        if (!accountSeed) throw new Error('Account seed is empty');
        let ret: number = -1

        const wa = WotsAddress.wotsAddressFromBytes(firstWotsAddress.slice(0, 2144));
        //check whether the firstWotsAddressHash is the same as the wotsAddrHash
        if (Buffer.from(wa.getAddrHash()!).toString('hex') === Buffer.from(wotsAddrHash).toString('hex')) {
            return -1;
        }

        for (let i = startIndex; i < endIndex; i++) {

            const secret = Derivation.deriveSeed(accountSeed, i);
            const ww = WOTSWallet.create('', secret.secret, undefined, (bytes) => {
                if (secret.prng) {
                    const len = bytes.length;
                    const randomBytes = secret.prng.nextBytes(len);
                    bytes.set(randomBytes);
                }
            })
            if (Buffer.from(ww.getAddrHash()!).toString('hex') === Buffer.from(wotsAddrHash).toString('hex')) {
                ret = i;
                break;
            }
        }
        return ret;
    }


    /**
     * Exports the master seed in encrypted form
     */
    async export(password: string): Promise<EncryptedData> {
        if (!this.seed) {
            throw new Error('No seed to export');
        }

        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(16));

        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(password),
            'PBKDF2',
            false,
            ['deriveBits', 'deriveKey']
        );

        const derivedKey = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt,
                iterations: PBKDF2_ITERATIONS,
                hash: 'SHA-256'
            },
            key,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt']
        );

        // Encrypt the seed
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            derivedKey,
            this.seed
        );

        return {
            data: Buffer.from(encrypted).toString('base64'),
            iv: Buffer.from(iv).toString('base64'),
            salt: Buffer.from(salt).toString('base64')
        };
    }

    static async deriveKey(encrypted: EncryptedData, password: string): Promise<CryptoKey> {
        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(password),
            'PBKDF2',
            false,
            ['deriveBits', 'deriveKey']
        );


        const derivedKey = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: Buffer.from(encrypted.salt, 'base64'),
                iterations: PBKDF2_ITERATIONS,
                hash: 'SHA-256'
            },
            key,
            { name: 'AES-GCM', length: 256 },
            true,
            ['decrypt']
        );
        return derivedKey;
    }

    /**
     * Creates a MasterSeed instance from an encrypted seed
     */
    static async import(encrypted: EncryptedData, password: string): Promise<MasterSeed> {
        try {
            const encryptedData = Buffer.from(encrypted.data, 'base64');
            const iv = Buffer.from(encrypted.iv, 'base64');
            const derivedKey = await this.deriveKey(encrypted, password);

            // Decrypt the seed
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                derivedKey,
                encryptedData
            );

            return new MasterSeed(new Uint8Array(decrypted));
        } catch (error) {
            console.error('Decryption error:', error);
            throw new Error('Failed to decrypt master seed - invalid password');
        }
    }

    static async importFromDerivedKey(encrypted: EncryptedData, derivedKey: CryptoKey): Promise<MasterSeed> {
        // Decrypt the seed
        const encryptedData = Buffer.from(encrypted.data, 'base64');
        const iv = Buffer.from(encrypted.iv, 'base64');
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            derivedKey,
            encryptedData
        );

        return new MasterSeed(new Uint8Array(decrypted));
    }

    static async importFromDerivedKeyJWK(encrypted: EncryptedData, derivedKey: JsonWebKey): Promise<MasterSeed> {
        const importedKey = await crypto.subtle.importKey(
            'jwk',
            derivedKey,
            { name: 'AES-GCM', length: 256 },
            true,
            ['decrypt']
        );
        return this.importFromDerivedKey(encrypted, importedKey);
    }

    /**
     * Derives a storage key from the master seed using HKDF-like construction
     * Returns a 32-byte key suitable for AES-256
     */
    deriveStorageKey(): Uint8Array {
        if (this._isLocked || !this.seed) {
            throw new Error('Master seed is locked');
        }

        // Convert seed to WordArray
        const seedWordArray = CryptoJS.enc.Hex.parse(
            Buffer.from(this.seed).toString('hex')
        );

        // Initial hash with domain separator
        const initialHash = CryptoJS.SHA256(
            CryptoJS.enc.Utf8.parse('mochimo_storage_key_v1').concat(seedWordArray)
        );

        // HMAC extraction step
        const prk = CryptoJS.HmacSHA256(
            initialHash,
            'mochimo_storage_salt'
        );

        // Expansion step
        const storageKey = CryptoJS.HmacSHA256(
            'mochimo_storage_info',
            prk
        );

        // Convert WordArray to Uint8Array
        return new Uint8Array(
            Buffer.from(storageKey.toString(CryptoJS.enc.Hex), 'hex')
        );
    }

    /**
     * Derives a storage key using native Web Crypto API
     */
    async deriveStorageKeyNative(): Promise<Uint8Array> {
        if (this._isLocked || !this.seed) {
            throw new Error('Master seed is locked');
        }

        const encoder = new TextEncoder();


        // Initial hash with domain separator (matching CryptoJS implementation)
        const domainSeparator = encoder.encode('mochimo_storage_key_v1');
        const seedBytes = this.seed;

        // Concatenate domain separator and seed (matching CryptoJS)
        const initialData = new Uint8Array(domainSeparator.length + seedBytes.length);
        initialData.set(domainSeparator);
        initialData.set(seedBytes, domainSeparator.length);


        // Create SHA-256 hash of concatenated data
        const initialHashBuffer = await crypto.subtle.digest('SHA-256', initialData);
        const initialHash = new Uint8Array(initialHashBuffer);


        // HMAC extraction step
        const extractKey = await crypto.subtle.importKey(
            'raw',
            encoder.encode('mochimo_storage_salt'),
            {
                name: 'HMAC',
                hash: 'SHA-256'
            },
            false,
            ['sign']
        );
        const prkBuffer = await crypto.subtle.sign(
            'HMAC',
            extractKey,
            initialHash
        );
        const prk = new Uint8Array(prkBuffer);


        // Expansion step
        const expandKey = await crypto.subtle.importKey(
            'raw',
            prk,
            {
                name: 'HMAC',
                hash: 'SHA-256'
            },
            false,
            ['sign']
        );
        const storageKeyBuffer = await crypto.subtle.sign(
            'HMAC',
            expandKey,
            encoder.encode('mochimo_storage_info')
        );
        const storageKey = new Uint8Array(storageKeyBuffer);

        return storageKey;
    }
}