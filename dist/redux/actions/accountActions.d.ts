import { AppThunk } from '../store';
import { Account } from '../../types/account';

export declare const updateAccountAction: (id: string, updates: Partial<Account>) => AppThunk;
export declare const renameAccountAction: (id: string, name: string) => AppThunk;
export declare const updateAccountWOTSAction: (accountId: string) => AppThunk;
export declare const importMCMAccountAction: (name: string, address: string, seed: string, tag: string, wotsIndex: number) => AppThunk<Account>;
export declare const bulkImportMCMAccountsAction: (accounts: Array<{
    name: string;
    address: string;
    seed: string;
    tag: string;
    wotsIndex: number;
}>) => AppThunk;
export declare const deleteAccountAction: import('@reduxjs/toolkit').AsyncThunk<void, string, {
    state: import('../store').RootState;
    dispatch: import('../store').AppDispatch;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export declare const reorderAccountsAction: (newOrder: {
    [accountId: string]: number;
}) => AppThunk;
