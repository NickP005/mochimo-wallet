export declare function intToBytes(num: number): Uint8Array;
export declare function wordArrayToBytes(wordArray: any): Uint8Array;
export declare class DigestRandomGenerator {
    private static CYCLE_COUNT;
    private stateCounter;
    private seedCounter;
    private state;
    private seed;
    constructor();
    private digestAddCounter;
    private digest;
    private cycleSeed;
    private generateState;
    addSeedMaterial(seed: Uint8Array): void;
    nextBytes(length: number): Uint8Array;
}
