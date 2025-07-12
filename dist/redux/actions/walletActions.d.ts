import { Account } from '../../types/account';
import { AppThunk } from '../store';
import { ImportAccountsOptions, ImportOptions, WalletExportedJSON } from '../types/state';

export declare const createWalletAction: import('@reduxjs/toolkit').AsyncThunk<{
    mnemonic: string | undefined;
}, {
    password: string;
    mnemonic?: string;
}, {
    state?: unknown;
    dispatch?: import('redux-thunk').ThunkDispatch<unknown, unknown, import('redux').UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const unlockWalletAction: (key: string, type?: "password" | "seed" | "jwk" | "mnemonic") => AppThunk<{
    jwk: JsonWebKey | null;
    storageKey: Uint8Array | null;
}>;
export declare const createAccountAction: (name?: string) => AppThunk<Account>;
export declare const exportWalletJSONAction: (password: string) => AppThunk<WalletExportedJSON>;
export declare const loadWalletJSONAction: (walletJSON: WalletExportedJSON, password: string) => AppThunk<void>;
export declare const lockWalletAction: () => AppThunk;
export declare const setSelectedAccountAction: (accountId: string | null) => AppThunk<void>;
export declare const importFromMcmFileAction: import('@reduxjs/toolkit').AsyncThunk<{
    entries: import('../..').WOTSEntry[];
    totalEntries: number;
    importedCount: number;
}, ImportOptions, {
    state?: unknown;
    dispatch?: import('redux-thunk').ThunkDispatch<unknown, unknown, import('redux').UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const importAccountsFromMcmAction: import('@reduxjs/toolkit').AsyncThunk<{
    importedAccounts: Account[];
    totalAvailable: number;
    importedCount: number;
}, ImportAccountsOptions, {
    state?: unknown;
    dispatch?: import('redux-thunk').ThunkDispatch<unknown, unknown, import('redux').UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
