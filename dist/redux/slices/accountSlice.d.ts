import { AccountState } from '../types/state';
import { Account } from '../../types/account';

export declare const addAccount: import('@reduxjs/toolkit').ActionCreatorWithPayload<{
    id: string;
    account: AccountState["accounts"][string];
}, "accounts/addAccount">, updateAccount: import('@reduxjs/toolkit').ActionCreatorWithPayload<{
    id: string;
    updates: Partial<AccountState["accounts"][string]>;
}, "accounts/updateAccount">, removeAccount: import('@reduxjs/toolkit').ActionCreatorWithPayload<string, "accounts/removeAccount">, setSelectedAccount: import('@reduxjs/toolkit').ActionCreatorWithPayload<string | null, "accounts/setSelectedAccount">, setLoading: import('@reduxjs/toolkit').ActionCreatorWithPayload<boolean, "accounts/setLoading">, setError: import('@reduxjs/toolkit').ActionCreatorWithPayload<string | null, "accounts/setError">, renameAccount: import('@reduxjs/toolkit').ActionCreatorWithPayload<{
    id: string;
    name: string;
}, "accounts/renameAccount">, reorderAccounts: import('@reduxjs/toolkit').ActionCreatorWithPayload<{
    [accountId: string]: number;
}, "accounts/reorderAccounts">, moveAccount: import('@reduxjs/toolkit').ActionCreatorWithPayload<{
    id: string;
    direction: "up" | "down";
}, "accounts/moveAccount">, reset: import('@reduxjs/toolkit').ActionCreatorWithoutPayload<"accounts/reset">, bulkAddAccounts: import('@reduxjs/toolkit').ActionCreatorWithPayload<Record<string, Account>, "accounts/bulkAddAccounts">;
export declare const selectOrderedAccounts: (state: {
    accounts: AccountState;
}) => {
    name: string;
    type: import('../..').AccountType;
    balance: string;
    tag: string;
    index?: number;
    source?: "mnemonic" | "mcm" | "keypair";
    order?: number;
    wotsIndex: number;
    seed: string;
    faddress: string;
    avatar?: string;
    isDeleted?: boolean;
    id: string;
}[];
declare const _default: import('@reduxjs/toolkit').Reducer<AccountState>;
export default _default;
