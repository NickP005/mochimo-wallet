import { WalletState } from '../types/state';
import { NetworkType } from '../../types';

export declare const setInitialized: import('@reduxjs/toolkit').ActionCreatorWithPayload<boolean, "wallet/setInitialized">, setLocked: import('@reduxjs/toolkit').ActionCreatorWithPayload<boolean, "wallet/setLocked">, setHasWallet: import('@reduxjs/toolkit').ActionCreatorWithPayload<boolean, "wallet/setHasWallet">, setNetwork: import('@reduxjs/toolkit').ActionCreatorWithPayload<NetworkType, "wallet/setNetwork">, setError: import('@reduxjs/toolkit').ActionCreatorWithPayload<string | null, "wallet/setError">, reset: import('@reduxjs/toolkit').ActionCreatorWithoutPayload<"wallet/reset">, incrementHighestIndex: import('@reduxjs/toolkit').ActionCreatorWithoutPayload<"wallet/incrementHighestIndex">, setHighestIndex: import('@reduxjs/toolkit').ActionCreatorWithPayload<number, "wallet/setHighestIndex">;
declare const _default: import('@reduxjs/toolkit').Reducer<WalletState>;
export default _default;
