import { DecodeResult, GenericDecodeResult } from '../../crypto';
import { WalletExportedJSON } from '../types/state';

export declare const useWallet: () => {
    isLocked: boolean;
    hasWallet: boolean;
    isInitialized: boolean;
    error: string | null;
    network: import('../..').NetworkType;
    createWallet: (password: string, mnemonic?: string) => Promise<import('@reduxjs/toolkit').PayloadAction<{
        mnemonic: string | undefined;
    }, string, {
        arg: {
            password: string;
            mnemonic?: string;
        };
        requestId: string;
        requestStatus: "fulfilled";
    }, never> | import('@reduxjs/toolkit').PayloadAction<unknown, string, {
        arg: {
            password: string;
            mnemonic?: string;
        };
        requestId: string;
        requestStatus: "rejected";
        aborted: boolean;
        condition: boolean;
    } & ({
        rejectedWithValue: true;
    } | ({
        rejectedWithValue: false;
    } & {})), import('@reduxjs/toolkit').SerializedError>>;
    unlockWallet: (password: string, type?: "password" | "seed" | "jwk" | "mnemonic") => Promise<{
        jwk: JsonWebKey | null;
        storageKey: Uint8Array | null;
    }>;
    lockWallet: () => void;
    checkWallet: () => Promise<boolean>;
    importFromMcmFile: (mcmData: DecodeResult, password: string, accountFilter?: (index: number, seed: Uint8Array, name: string) => boolean) => Promise<import('@reduxjs/toolkit').PayloadAction<{
        entries: import('../../crypto').WOTSEntry[];
        totalEntries: number;
        importedCount: number;
    }, string, {
        arg: import('../types/state').ImportOptions;
        requestId: string;
        requestStatus: "fulfilled";
    }, never> | import('@reduxjs/toolkit').PayloadAction<unknown, string, {
        arg: import('../types/state').ImportOptions;
        requestId: string;
        requestStatus: "rejected";
        aborted: boolean;
        condition: boolean;
    } & ({
        rejectedWithValue: true;
    } | ({
        rejectedWithValue: false;
    } & {})), import('@reduxjs/toolkit').SerializedError>>;
    importAccountsFromMcm: (mcmData: DecodeResult, accountFilter?: (index: number, seed: Uint8Array, name: string) => boolean) => Promise<import('@reduxjs/toolkit').PayloadAction<{
        importedAccounts: import('../..').Account[];
        totalAvailable: number;
        importedCount: number;
    }, string, {
        arg: import('../types/state').ImportAccountsOptions;
        requestId: string;
        requestStatus: "fulfilled";
    }, never> | import('@reduxjs/toolkit').PayloadAction<unknown, string, {
        arg: import('../types/state').ImportAccountsOptions;
        requestId: string;
        requestStatus: "rejected";
        aborted: boolean;
        condition: boolean;
    } & ({
        rejectedWithValue: true;
    } | ({
        rejectedWithValue: false;
    } & {})), import('@reduxjs/toolkit').SerializedError>>;
    setHasWalletStatus: (hasWallet: boolean) => void;
    importWalletJSON: (walletJSON: WalletExportedJSON, password: string) => Promise<void>;
    exportWalletJSON: (password: string) => Promise<WalletExportedJSON>;
    verifyWalletOwnership: (password: string) => Promise<boolean>;
    getMnemonic: (password: string) => Promise<string | false>;
    importAccountsFrom: (source: "mcm" | "keypair", mcmData: GenericDecodeResult, accountFilter?: (index: number, seed: Uint8Array, name: string) => boolean) => Promise<import('@reduxjs/toolkit').PayloadAction<{
        importedAccounts: import('../..').Account[];
        totalAvailable: number;
        importedCount: number;
    }, string, {
        arg: import('../types/state').ImportAccountsOptions;
        requestId: string;
        requestStatus: "fulfilled";
    }, never> | import('@reduxjs/toolkit').PayloadAction<unknown, string, {
        arg: import('../types/state').ImportAccountsOptions;
        requestId: string;
        requestStatus: "rejected";
        aborted: boolean;
        condition: boolean;
    } & ({
        rejectedWithValue: true;
    } | ({
        rejectedWithValue: false;
    } & {})), import('@reduxjs/toolkit').SerializedError>>;
};
