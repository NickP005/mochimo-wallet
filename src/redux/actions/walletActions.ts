import {
    setInitialized,
    setLocked,
    setHasWallet,
    setError,
    setHighestIndex,

} from '../slices/walletSlice';
import { addAccount, bulkAddAccounts, setSelectedAccount } from '../slices/accountSlice';
import { StorageProvider } from '../context/StorageContext';
import { SessionManager } from '../context/SessionContext';
import { Account } from '../../types/account';
import { EncryptedData } from '../../crypto/encryption';
import { MasterSeed } from '../../core/MasterSeed';
import { AppThunk } from '../store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { DecodeResult } from '@/crypto/mcmDecoder';
import { ImportAccountsOptions, ImportOptions, WalletJSON } from '../types/state';
import { WotsAddress } from 'mochimo-wots';



// Create new wallet
export const createWalletAction = createAsyncThunk(
    'wallet/create',
    async ({ password, mnemonic }: { password: string; mnemonic?: string }, { dispatch, rejectWithValue }) => {
        try {
            let masterSeed: MasterSeed;
            let generatedMnemonic: string | undefined;

            if (mnemonic) {
                masterSeed = await MasterSeed.fromPhrase(mnemonic);
            } else {
                masterSeed = await MasterSeed.create();
                generatedMnemonic = await masterSeed.toPhrase();
            }

            const storage = StorageProvider.getStorage();
            const encrypted = await masterSeed.export(password);
            await storage.saveMasterSeed(encrypted);

            // Set wallet state
            dispatch(setHasWallet(true));
            dispatch(setInitialized(true));
            dispatch(setLocked(true));

            return { mnemonic: generatedMnemonic };
        } catch (error) {
            console.error('Failed to create wallet:', error);
            dispatch(setError('Failed to create wallet'));
            return rejectWithValue('Failed to create wallet');
        }
    }
);


// Unlock wallet
export const unlockWalletAction = (password: string): AppThunk => async (dispatch) => {
    try {
        const storage = StorageProvider.getStorage();

        await SessionManager.getInstance().unlock(password, storage);
        const storageKey = SessionManager.getInstance().getStorageKey();
        // Load accounts and highest index
        const [accounts, highestIndex, activeAccount] = await Promise.all([
            storage.loadAccounts(storageKey),
            storage.loadHighestIndex(),
            storage.loadActiveAccount()
        ]);

        const accountsObject = accounts.reduce((acc, account) => {
            if (account.tag) {
                acc[account.tag] = account;
            }
            return acc;
        }, {} as Record<string, Account>);
        dispatch(bulkAddAccounts(accountsObject));
        dispatch(setHighestIndex(highestIndex));
        dispatch(setSelectedAccount(activeAccount));
        dispatch(setLocked(false));
        dispatch(setHasWallet(true));
    } catch (error) {
        dispatch(setError('Invalid password'));
        throw error;
    }
};

// Create account
export const createAccountAction = (name?: string): AppThunk<Account> => async (dispatch, getState) => {
    try {
        const storage = StorageProvider.getStorage();
        const session = SessionManager.getInstance();
        const masterSeed =  session.getMasterSeed();

        // Get next account index from state
        const state = getState();
        const accountIndex = state.wallet.highestAccountIndex + 1;

        // Generate account tag

        const w = masterSeed.deriveAccount(accountIndex);

        const account: Account = {
            name: name || 'Account ' + (accountIndex + 1),
            type: 'standard' as const,
            faddress: Buffer.from(w.address).toString('hex'),
            balance: '0',
            index: accountIndex,
            tag: w.tag,
            source: 'mnemonic' as const,
            wotsIndex: -1, //first wots address is created using account seed
            seed: Buffer.from(w.seed).toString('hex'),
            order: Object.keys(state.accounts.accounts).length // Use index as initial order
        };

        const storageKey = session.getStorageKey();

        await Promise.all([
            storage.saveAccount(account, storageKey),
            storage.saveHighestIndex(accountIndex)
        ]);

        dispatch(addAccount({ id: account.tag, account }));
        dispatch(setHighestIndex(accountIndex));
        return account;

    } catch (error) {
        dispatch(setError('Failed to create account'));
        throw error;
    }
};

// Export wallet
export const exportWalletJSONAction = (password: string): AppThunk<WalletJSON> => async (dispatch, getState) => {
    try {
        const state = getState();
        const session = SessionManager.getInstance();
        const ms = await session.getMasterSeed();
        if (!ms) {
            throw new Error('Wallet is locked');
        }
        const accounts = state.accounts.accounts;
        return {
            version: '1.0.0',
            timestamp: Date.now(),
            encrypted: await ms.export(password),
            accounts: accounts
        };
    } catch (error) {
        dispatch(setError('Failed to export wallet'));
        throw error;
    }
};



export const loadWalletJSONAction = (
    walletJSON: WalletJSON,
    password: string
): AppThunk<void> => async (dispatch) => {
    try {
        const storage = StorageProvider.getStorage();
        const session = SessionManager.getInstance();

        // Clear existing storage
        await storage.clear();

        // Save encrypted master seed
        await storage.saveMasterSeed(walletJSON.encrypted);

        // Unlock the wallet with new master seed
        await session.unlock(password, storage);

        // Save accounts to storage and get highest index
        let highestIndex = -1;
        const storageKey = session.getStorageKey();
        await Promise.all(
            Object.values(walletJSON.accounts).map(async (account) => {
                await storage.saveAccount(account, storageKey);
                if (account.index !== undefined && account.index > highestIndex) {
                    highestIndex = account.index;
                }
            })
        );

        // Save highest index
        await storage.saveHighestIndex(highestIndex);

        // Update Redux state
        dispatch(bulkAddAccounts(walletJSON.accounts));
        dispatch(setHighestIndex(highestIndex));
        dispatch(setHasWallet(true));
        dispatch(setLocked(false));
        dispatch(setInitialized(true));

    } catch (error) {
        dispatch(setError('Failed to load wallet from JSON'));
        throw error;
    }
};

export const lockWalletAction = (): AppThunk => async (dispatch) => {
    try {
        const session = SessionManager.getInstance();
        await session.lock();
        dispatch(setLocked(true));
    } catch (error) {
        dispatch(setError('Failed to lock wallet'));
    }
};

export const setSelectedAccountAction = (
    accountId: string | null
): AppThunk<void> => async (dispatch, getState) => {
    try {
        const storage = StorageProvider.getStorage();
        const state = getState();
        const accounts = state.accounts.accounts;
        if (accountId && accounts[accountId]) {
            // Update Redux state
            dispatch(setSelectedAccount(accountId));
            // Save to storage
            await storage.saveActiveAccount(accountId);
        }

    } catch (error) {
        dispatch(setError('Failed to set active account'));
        throw error;
    }
};



export const importFromMcmFileAction = createAsyncThunk(
    'wallet/importFromMcm',
    async ({ mcmData, password, accountFilter }: ImportOptions, { dispatch }) => {
        try {
            dispatch(setError(null));

            // 1. Clear existing state/storage
            const storage = StorageProvider.getStorage();
            await storage.clear();

            // 2. Get MCM data
            const { entries, privateHeader } = mcmData;
            console.log('Private header:', privateHeader);
            const detSeed = privateHeader['deterministic seed hex'];

            // 3. Create master seed and set up wallet
            const masterSeed = new MasterSeed(Buffer.from(detSeed, 'hex')); 
            const encrypted = await masterSeed.export(password);
            await storage.saveMasterSeed(encrypted);

            // 4. Set up wallet state BEFORE importing accounts
            dispatch(setHasWallet(true));
            dispatch(setInitialized(true));
            dispatch(setLocked(false));

            // 5. Set session state
            const session = SessionManager.getInstance();
            session.setMasterSeed(masterSeed);

            // 6. Now import accounts
            const results = await dispatch(importAccountsFromMcmAction({ 
                mcmData, 
                accountFilter, 
                source: 'mnemonic' 
            })).unwrap();
             
            return { 
                entries: entries,
                totalEntries: entries.length,
                importedCount: results.importedCount
            };
        } catch (error) {
            console.error('Import error:', error);
            dispatch(setError(error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }
);





export const importAccountsFromMcmAction = createAsyncThunk(
    'wallet/importAccounts',
    async ({ mcmData, accountFilter, source }: ImportAccountsOptions, { dispatch, getState }) => {
        try {
            dispatch(setError(null));

            // 1. Verify we have an unlocked wallet
            const state = getState() as RootState;
            if (!state.wallet.hasWallet || state.wallet.locked) {
                throw new Error('Wallet must be unlocked to import accounts');
            }

            // 2. Decode MCM file
            const { entries } = mcmData;

            // 3. Filter accounts based on options
            let filteredEntries = entries;
            if (accountFilter) {
                filteredEntries = entries.filter((entry, index) => {
                    if (accountFilter(index, Buffer.from(entry.secret, 'hex'), entry.name)) return true;
                    return false;
                });
            }

            if (filteredEntries.length === 0) {
                throw new Error('No accounts matched the filter criteria');
            }

            // 4. Get storage and current highest index
            const storage = StorageProvider.getStorage();
            const session = SessionManager.getInstance();
            const storageKey = session.getStorageKey();
            const currentHighestIndex = state.wallet.highestAccountIndex;
            // 5. Create and save new accounts
            const accounts: Account[] = filteredEntries.map((entry, index) => ({
                name: entry.name || `Imported Account ${index + 1}`,
                type: source === 'mnemonic' ? 'standard' : 'imported',
                faddress: entry.address,
                balance: '0',
                index: source === 'mnemonic' ? currentHighestIndex + 1 + index : undefined, // Continue from current highest
                tag: Buffer.from(WotsAddress.wotsAddressFromBytes(Buffer.from(entry.address, 'hex').subarray(0, 2144)).getTag()).toString('hex'),
                source: source,
                wotsIndex: -1,
                seed: entry.secret,
                order: Object.keys(state.accounts.accounts).length + index // Add to end
            }));
            console.log('Imported accounts:', accounts);

            // 6. Save accounts
            await Promise.all([
                ...accounts.map(account => storage.saveAccount(account, storageKey)),
                storage.saveHighestIndex(currentHighestIndex + accounts.length)
            ]);

            // 7. Update account state
            dispatch(setHighestIndex(currentHighestIndex + accounts.length));
            dispatch(bulkAddAccounts(
                accounts.reduce((acc, account) => {
                    acc[account.tag] = account;
                    return acc;
                }, {} as Record<string, Account>)
            ));

            return { 
                importedAccounts: accounts,
                totalAvailable: entries.length,
                importedCount: accounts.length
            };
        } catch (error) {
            console.error('Import accounts error:', error);
            dispatch(setError(error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }
); 