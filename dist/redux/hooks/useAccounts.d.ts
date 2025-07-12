import { Account } from '../../types/account';

export declare const useAccounts: () => {
    accounts: Account[];
    deletedAccounts: Account[];
    selectedAccount: string | null;
    createAccount: (name: string) => Promise<Account>;
    renameAccount: (id: string, name: string) => Promise<void>;
    deleteAccount: (id: string) => Promise<import('@reduxjs/toolkit').PayloadAction<void, string, {
        arg: string;
        requestId: string;
        requestStatus: "fulfilled";
    }, never> | import('@reduxjs/toolkit').PayloadAction<unknown, string, {
        arg: string;
        requestId: string;
        requestStatus: "rejected";
        aborted: boolean;
        condition: boolean;
    } & ({
        rejectedWithValue: true;
    } | ({
        rejectedWithValue: false;
    } & {})), import('@reduxjs/toolkit').SerializedError>>;
    reorderAccounts: (newOrder: Record<string, number>) => Promise<void>;
    setSelectedAccount: (id: string | null) => Promise<void>;
    updateAccount: (id: string, account: Partial<Account>) => Promise<void>;
    currentWOTSKeyPair: {
        address: string;
        secret: string;
        wotsWallet: import('mochimo-wots').WOTSWallet;
    } | null;
    nextWOTSKeyPair: {
        address: string;
        secret: string;
        wotsWallet: import('mochimo-wots').WOTSWallet;
    } | null;
};
