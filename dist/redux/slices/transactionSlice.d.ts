import { TransactionState } from '../types/state';

export declare const setLoading: import('@reduxjs/toolkit').ActionCreatorWithPayload<boolean, "transaction/setLoading">, setError: import('@reduxjs/toolkit').ActionCreatorWithPayload<string | null, "transaction/setError">, addPendingTransaction: import('@reduxjs/toolkit').ActionCreatorWithPayload<string, "transaction/addPendingTransaction">, removePendingTransaction: import('@reduxjs/toolkit').ActionCreatorWithPayload<string, "transaction/removePendingTransaction">;
declare const _default: import('@reduxjs/toolkit').Reducer<TransactionState>;
export default _default;
