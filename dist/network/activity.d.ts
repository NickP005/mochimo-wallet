import { Account } from '../types/account';

export interface WalletTransaction {
    type: 'send' | 'receive' | 'mining';
    amount: string;
    timestamp: number;
    address: string;
    txid?: string;
    blockNumber?: number;
    pending?: boolean;
    fee?: string;
    memo?: string;
}
/**
 * Fetches and normalizes all recent transactions for an account (confirmed and mempool).
 * Returns a ready-to-use array of WalletTransaction for UI.
 */
export declare function fetchRecentActivity(account: Account): Promise<WalletTransaction[]>;
/**
 * React hook to get recent activity for an account.
 * Returns { transactions, loading, refresh }
 */
export declare function useRecentActivity(account: Account): {
    transactions: WalletTransaction[];
    loading: boolean;
    refresh: () => Promise<void>;
};
