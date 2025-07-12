interface SendTransactionParams {
    to: string;
    amount: bigint;
    memo?: string;
}
export declare const sendTransactionAction: import('@reduxjs/toolkit').AsyncThunk<string, SendTransactionParams, {
    state?: unknown;
    dispatch?: import('redux-thunk').ThunkDispatch<unknown, unknown, import('redux').UnknownAction>;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}>;
export interface TransactionOptions {
    fee?: bigint;
    memo?: string;
}
export {};
