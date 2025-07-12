import { NetworkService, TagActivationResponse, TagResolveResponse, TransactionResponse } from '../types/network';

export declare class ProxyNetworkService implements NetworkService {
    apiUrl: string;
    getAccountBalance(address: string): Promise<any>;
    getMempoolTransactions(): Promise<any>;
    getMempoolTransaction(txHash: string): Promise<any>;
    waitForTransaction(transactionHash: string, timeout?: number, interval?: number): Promise<any>;
    getNetworkOptions(): Promise<any>;
    getBlock(identifier: any): Promise<{
        block: any;
    }>;
    getBlockTransaction(blockIdentifier: any, transactionHash: string): Promise<any>;
    submit(signedTransaction: string): Promise<any>;
    derive(publicKey: string, tag: string): Promise<any>;
    preprocess(operations: any[], metadata: any): Promise<any>;
    metadata(options: any, publicKeys: any[]): Promise<any>;
    payloads(operations: any[], metadata: any, publicKeys: any[]): Promise<any>;
    combine(unsignedTransaction: string, signatures: any[]): Promise<any>;
    parse(transaction: string, signed: boolean): Promise<any>;
    searchTransactionsByAddress(address: string, options?: {
        limit?: number;
        offset?: number;
        max_block?: number;
        status?: string;
    }): Promise<any>;
    searchTransactionsByBlock(blockIdentifier: any, options?: {
        limit?: number;
        offset?: number;
        status?: string;
    }): Promise<any>;
    searchTransactionsByTxId(transactionHash: string, options?: {
        max_block?: number;
        status?: string;
    }): Promise<any>;
    getEventsBlocks(options?: {
        limit?: number;
        offset?: number;
    }): Promise<any>;
    getStatsRichlist(options?: {
        ascending?: boolean;
        offset?: number;
        limit?: number;
    }): Promise<any>;
    getNetworkStatus(): Promise<{
        height: number;
        nodes: any[];
    }>;
    constructor(apiUrl: string);
    getBalance(tag: string): Promise<string>;
    resolveTag(tag: string): Promise<TagResolveResponse>;
    pushTransaction(transaction: string, recipients?: number): Promise<TransactionResponse>;
    activateTag(wotsAddress: string): Promise<TagActivationResponse>;
}
