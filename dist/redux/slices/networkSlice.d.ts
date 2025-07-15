import { NetworkState } from '../../types/network';

export declare const setBlockHeight: import('@reduxjs/toolkit').ActionCreatorWithPayload<number, "network/setBlockHeight">, setNetworkStatus: import('@reduxjs/toolkit').ActionCreatorWithPayload<{
    isConnected: boolean;
    error?: string;
}, "network/setNetworkStatus">;
declare const _default: import('@reduxjs/toolkit').Reducer<NetworkState>;
export default _default;
