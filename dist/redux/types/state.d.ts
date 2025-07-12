import { DecodeResult, EncryptedAccount, EncryptedData, GenericDecodeResult } from '../../crypto';
import { NetworkType, Account } from '../../types/account';

export interface WalletState {
    initialized: boolean;
    locked: boolean;
    hasWallet: boolean;
    network: NetworkType;
    error: string | null;
    highestAccountIndex: number;
}
export interface AccountState {
    accounts: {
        [id: string]: Account;
    };
    selectedAccount: string | null;
    loading: boolean;
    error: string | null;
}
export interface RootState {
    wallet: WalletState;
    accounts: AccountState;
}
export interface NetworkState {
    isLoading: boolean;
    error: Error | null;
}
export interface TransactionState {
    isLoading: boolean;
    error: string | null;
    pendingTransactions: string[];
}
export interface ImportAccountsOptions {
    mcmData: GenericDecodeResult;
    accountFilter?: (index: number, seed: Uint8Array, name: string) => boolean;
    source: 'mnemonic' | 'mcm' | 'keypair';
}
export interface ImportOptions {
    mcmData: DecodeResult;
    password: string;
    accountFilter?: (index: number, seed: Uint8Array, name: string) => boolean;
}
export interface WalletExportedJSON {
    version: string;
    timestamp: number;
    encrypted: EncryptedData;
    accounts: Record<string, EncryptedAccount>;
}
export declare function isImportedAccount(account: Account): account is Account & {
    seed: string;
};
