/**
 * Mochimo Wallet API endpoints management.
 * Provides functions to get, set, and validate the active API endpoint.
 */
export interface ApiEndpoint {
    label: string;
    url: string;
}
/**
 * Returns the list of available API endpoints.
 */
export declare function getApiEndpoints(): ApiEndpoint[];
/**
 * Returns the currently selected API endpoint (from StorageProvider or default).
 * If no endpoint is saved, returns the first endpoint in the list.
 */
export declare function getCurrentApiEndpoint(): Promise<string>;
/**
 * Sets the active API endpoint and saves it to StorageProvider.
 * Returns true if the URL is valid and was saved, false otherwise.
 */
export declare function setApiEndpoint(endpoint: string): Promise<boolean>;
/**
 * Validates that the endpoint is a valid URL (http or https) or the string 'custom'.
 */
export declare function validateApiEndpoint(endpoint: string): boolean;
export declare function useApiEndpoint(): readonly [string, (ep: string) => Promise<boolean>, boolean, string | null];
