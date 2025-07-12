import { default as CryptoJS } from 'crypto-js';
import { DigestRandomGenerator } from './digestRandomGenerator';

export interface PublicHeader {
    'pbkdf2 salt': string;
    'pbkdf2 iteration': string;
    version: string;
}
export interface PrivateHeader {
    name: string;
    'deterministic seed hex': string;
}
export interface WOTSEntry {
    address: string;
    secret: string;
    name: string;
}
export interface DecodeResult {
    publicHeader: PublicHeader;
    privateHeader: PrivateHeader;
    entries: WOTSEntry[];
}
export interface GenericDecodeResult {
    entries: WOTSEntry[];
}
export declare class MCMDecoder {
    private static parseJavaByteArray;
    static arrayBufferToWordArray(buffer: Uint8Array): CryptoJS.lib.WordArray;
    static wordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray): Uint8Array;
    private static decryptData;
    static generateDeterministicSecret(deterministicSeed: Uint8Array, id: number, tag: string): {
        secret: Uint8Array;
        address: Uint8Array;
    };
    static decode(mcmFile: ArrayBuffer, password: string): Promise<DecodeResult>;
}
export declare function deriveSecret(deterministicSeed: Uint8Array, id: number): {
    secret: Uint8Array;
    prng: DigestRandomGenerator;
};
