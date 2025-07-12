import { MasterSeed } from '../../core/MasterSeed';
import { Storage } from '../../types/storage';

export declare class SessionManager {
    private static instance;
    private masterSeed;
    private storageKey;
    private constructor();
    static getInstance(): SessionManager;
    unlock(password: string, storage: Storage): Promise<{
        jwk: JsonWebKey;
        storageKey: Uint8Array;
    }>;
    unlockWithSeed(seed: string): Promise<void>;
    unlockWithMnemonic(mnemonic: string): Promise<void>;
    unlockWithDerivedKey(derivedKey: JsonWebKey, storage: Storage): Promise<void>;
    getMasterSeed(): MasterSeed;
    getStorageKey(): Uint8Array;
    lock(): void;
    setMasterSeed(masterSeed: MasterSeed): void;
}
