export type NetworkType = 'mainnet' | 'testnet' | 'devnet';
export type AccountType = 'standard' | 'imported' | 'hardware';
export interface Account {
    name: string;
    type: AccountType;
    balance: string;
    tag: string;
    index?: number;
    source?: 'mnemonic' | 'mcm' | 'keypair';
    order?: number;
    wotsIndex: number;
    seed: string;
    faddress: string;
    avatar?: string;
    isDeleted?: boolean;
}
