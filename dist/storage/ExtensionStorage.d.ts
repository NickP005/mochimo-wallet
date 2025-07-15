import { Storage } from '../types/storage';
import { Account } from '../types/account';
import { EncryptedData } from '../crypto/webCrypto';

export declare class ExtensionStorage implements Storage {
    private storage;
    private prefix;
    constructor(prefix?: string);
    private getKey;
    saveMasterSeed(seed: EncryptedData): Promise<void>;
    loadMasterSeed(): Promise<EncryptedData | null>;
    saveAccount(account: Account, storageKey: Uint8Array): Promise<void>;
    loadAccount(id: string, storageKey: Uint8Array): Promise<Account | null>;
    loadAccounts(storageKey: Uint8Array): Promise<Account[]>;
    deleteAccount(id: string): Promise<void>;
    saveActiveAccount(id: string | null): Promise<void>;
    loadActiveAccount(): Promise<string | null>;
    saveHighestIndex(index: number): Promise<void>;
    loadHighestIndex(): Promise<number>;
    clear(): Promise<void>;
    setItem(key: string, value: string): Promise<void>;
    getItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
}
