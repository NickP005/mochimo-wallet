export declare const useTransaction: () => {
    isLoading: boolean;
    error: string | null;
    pendingTransactions: string[];
    sendTransaction: (to: string, amount: bigint, memo?: string) => Promise<string>;
    removePending: (txHash: string) => void;
};
