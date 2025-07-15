import { RootState } from '../store';

export declare const selectWalletStatus: ((state: {
    wallet: import('../types/state').WalletState;
    network: import('../../types/network').NetworkState;
    transaction: import('../types/state').TransactionState;
    accounts: import('../types/state').AccountState;
}) => {
    isLocked: boolean;
    hasWallet: boolean;
    isInitialized: boolean;
}) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: import('../types/state').WalletState) => {
        isLocked: boolean;
        hasWallet: boolean;
        isInitialized: boolean;
    };
    memoizedResultFunc: ((resultFuncArgs_0: import('../types/state').WalletState) => {
        isLocked: boolean;
        hasWallet: boolean;
        isInitialized: boolean;
    }) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => {
        isLocked: boolean;
        hasWallet: boolean;
        isInitialized: boolean;
    };
    dependencies: [(state: RootState) => import('../types/state').WalletState];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    argsMemoize: typeof import('@reduxjs/toolkit').weakMapMemoize;
    memoize: typeof import('@reduxjs/toolkit').weakMapMemoize;
};
export declare const selectWalletError: ((state: {
    wallet: import('../types/state').WalletState;
    network: import('../../types/network').NetworkState;
    transaction: import('../types/state').TransactionState;
    accounts: import('../types/state').AccountState;
}) => string | null) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: import('../types/state').WalletState) => string | null;
    memoizedResultFunc: ((resultFuncArgs_0: import('../types/state').WalletState) => string | null) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => string | null;
    dependencies: [(state: RootState) => import('../types/state').WalletState];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    argsMemoize: typeof import('@reduxjs/toolkit').weakMapMemoize;
    memoize: typeof import('@reduxjs/toolkit').weakMapMemoize;
};
export declare const selectNetwork: ((state: {
    wallet: import('../types/state').WalletState;
    network: import('../../types/network').NetworkState;
    transaction: import('../types/state').TransactionState;
    accounts: import('../types/state').AccountState;
}) => import('../..').NetworkType) & {
    clearCache: () => void;
    resultsCount: () => number;
    resetResultsCount: () => void;
} & {
    resultFunc: (resultFuncArgs_0: import('../types/state').WalletState) => import('../..').NetworkType;
    memoizedResultFunc: ((resultFuncArgs_0: import('../types/state').WalletState) => import('../..').NetworkType) & {
        clearCache: () => void;
        resultsCount: () => number;
        resetResultsCount: () => void;
    };
    lastResult: () => import('../..').NetworkType;
    dependencies: [(state: RootState) => import('../types/state').WalletState];
    recomputations: () => number;
    resetRecomputations: () => void;
    dependencyRecomputations: () => number;
    resetDependencyRecomputations: () => void;
} & {
    argsMemoize: typeof import('@reduxjs/toolkit').weakMapMemoize;
    memoize: typeof import('@reduxjs/toolkit').weakMapMemoize;
};
