import { Storage } from '../types/storage';

export declare class StorageFactory {
    /**
     * Creates appropriate storage implementation based on environment
     */
    static create(prefix?: string): Storage;
}
