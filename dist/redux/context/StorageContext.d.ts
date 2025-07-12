import { Storage } from '../../types/storage';

export declare const StorageProvider: {
    setStorage: (storage: Storage) => void;
    getStorage: () => Storage;
};
export type { Storage };
