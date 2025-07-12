import { Account } from '../types/account';
import { EncryptedData } from './webCrypto';

export interface EncryptedAccount {
    tag: string;
    encryptedData: EncryptedData;
}
export declare const encryptAccount: (account: Account, storageKey: Uint8Array) => Promise<EncryptedAccount>;
export declare const decryptAccount: (encryptedAccount: EncryptedAccount, storageKey: Uint8Array) => Promise<Account>;
