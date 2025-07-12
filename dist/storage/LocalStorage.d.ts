import { Storage } from '../types/storage';
import { Account } from '../types/account';
import { EncryptedData } from '../crypto/webCrypto';

export declare class LocalStorage implements Storage {
    private readonly prefix;
    constructor(prefix?: string);
    private getKey;
    saveMasterSeed(encrypted: EncryptedData): Promise<void>;
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
}
