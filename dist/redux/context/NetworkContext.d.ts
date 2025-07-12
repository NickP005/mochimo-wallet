import { NetworkService } from '../../types/network';

export declare const NetworkProvider: {
    setNetwork: (network: NetworkService) => void;
    getNetwork: () => NetworkService;
};
export type { NetworkService };
