import { RootState } from '../store';
import { WOTSWallet } from 'mochimo-wots';

export declare const selectAccounts: (state: RootState) => {
    [id: string]: import('../..').Account;
};
export declare const selectSelectedAccount: (state: RootState) => import('../..').Account | null;
export declare const selectOrderedAccounts: ((state: {
    wallet: import('../types/state').WalletState;
    network: import('../../types/network').NetworkState;
    transaction: import('../types/state').TransactionState;
    accounts: import('../types/state').AccountState;
}) => import('../..').Account[]) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: {
        [id: string]: import('../..').Account;
    }) => import('../..').Account[];
    memoizedResultFunc: ((resultFuncArgs_0: {
        [id: string]: import('../..').Account;
    }) => import('../..').Account[]) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => import('../..').Account[];
    dependencies: [(state: RootState) => {
        [id: string]: import('../..').Account;
    }];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    argsMemoize: typeof import('@reduxjs/toolkit').weakMapMemoize;
    memoize: typeof import('@reduxjs/toolkit').weakMapMemoize;
};
export declare const selectCurrentWOTSKeyPair: ((state: {
    wallet: import('../types/state').WalletState;
    network: import('../../types/network').NetworkState;
    transaction: import('../types/state').TransactionState;
    accounts: import('../types/state').AccountState;
}) => {
    address: string;
    secret: string;
    wotsWallet: WOTSWallet;
} | null) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: import('../..').Account | null) => {
        address: string;
        secret: string;
        wotsWallet: WOTSWallet;
    } | null;
    memoizedResultFunc: ((resultFuncArgs_0: import('../..').Account | null) => {
        address: string;
        secret: string;
        wotsWallet: WOTSWallet;
    } | null) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => {
        address: string;
        secret: string;
        wotsWallet: WOTSWallet;
    } | null;
    dependencies: [(state: RootState) => import('../..').Account | null];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    argsMemoize: typeof import('@reduxjs/toolkit').weakMapMemoize;
    memoize: typeof import('@reduxjs/toolkit').weakMapMemoize;
};
export declare const selectNextWOTSKeyPair: ((state: {
    wallet: import('../types/state').WalletState;
    network: import('../../types/network').NetworkState;
    transaction: import('../types/state').TransactionState;
    accounts: import('../types/state').AccountState;
}) => {
    address: string;
    secret: string;
    wotsWallet: WOTSWallet;
} | null) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: import('../..').Account | null) => {
        address: string;
        secret: string;
        wotsWallet: WOTSWallet;
    } | null;
    memoizedResultFunc: ((resultFuncArgs_0: import('../..').Account | null) => {
        address: string;
        secret: string;
        wotsWallet: WOTSWallet;
    } | null) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => {
        address: string;
        secret: string;
        wotsWallet: WOTSWallet;
    } | null;
    dependencies: [(state: RootState) => import('../..').Account | null];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    argsMemoize: typeof import('@reduxjs/toolkit').weakMapMemoize;
    memoize: typeof import('@reduxjs/toolkit').weakMapMemoize;
};
