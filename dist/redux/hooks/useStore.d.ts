import { TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../store';

export declare const useAppDispatch: () => import('@reduxjs/toolkit').ThunkDispatch<{
    wallet: import('../types/state').WalletState;
    network: import('../../types/network').NetworkState;
    transaction: import('../types/state').TransactionState;
    accounts: import('../types/state').AccountState;
}, undefined, import('@reduxjs/toolkit').UnknownAction> & import('@reduxjs/toolkit').Dispatch<import('@reduxjs/toolkit').UnknownAction>;
export declare const useAppSelector: TypedUseSelectorHook<RootState>;
