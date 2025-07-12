import { DigestRandomGenerator } from '../../crypto/digestRandomGenerator';
import { WOTSWallet } from 'mochimo-wots';

export declare class Derivation {
    static deriveAccountTag(masterSeed: Uint8Array, accountIndex: number): Uint8Array;
    static deriveSeed(deterministicSeed: Uint8Array, id: number): {
        secret: Uint8Array;
        prng: DigestRandomGenerator;
    };
    static deriveWotsSeedAndAddress(accountSeed: Uint8Array, wotsIndex: number, tag: string): {
        secret: Uint8Array;
        address: Uint8Array;
        wotsWallet: WOTSWallet;
    };
}
