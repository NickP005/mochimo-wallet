import { TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../store';

export declare const useAppDispatch: () => import('redux-thunk').ThunkDispatch<{
    wallet: import('../types/state').WalletState;
    network: import('../../types/network').NetworkState;
    transaction: import('../types/state').TransactionState;
    accounts: import('../types/state').AccountState;
}, undefined, import('redux').UnknownAction> & import('redux').Dispatch<import('redux').UnknownAction>;
export declare const useAppSelector: TypedUseSelectorHook<RootState>;
