import { Action, ThunkAction, ThunkDispatch, AnyAction, AsyncThunk } from '@reduxjs/toolkit';

export declare const store: import('@reduxjs/toolkit').EnhancedStore<{
    wallet: import('./types/state').WalletState;
    network: import('../types/network').NetworkState;
    transaction: import('./types/state').TransactionState;
    accounts: import('./types/state').AccountState;
}, import('@reduxjs/toolkit').UnknownAction, import('@reduxjs/toolkit').Tuple<[import('@reduxjs/toolkit').StoreEnhancer<{
    dispatch: ThunkDispatch<{
        wallet: import('./types/state').WalletState;
        network: import('../types/network').NetworkState;
        transaction: import('./types/state').TransactionState;
        accounts: import('./types/state').AccountState;
    }, undefined, import('@reduxjs/toolkit').UnknownAction>;
}>, import('@reduxjs/toolkit').StoreEnhancer]>>;
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AsyncThunkConfig = {
    state: RootState;
    dispatch: AppDispatch;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
};
export type AppThunk<ReturnType = void> = ThunkAction<Promise<ReturnType>, RootState, unknown, Action<string>>;
export type AppThunkDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
export type AsyncThunkAction<Returned, ThunkArg = void> = (arg: ThunkArg) => AsyncThunk<Returned, ThunkArg, AsyncThunkConfig>;
