/**
 * DDoS Protection Utility
 * Provides rate limiting functionality to prevent DDoS attacks
 */
export interface RateLimitOptions {
    windowMs: number;
    maxRequests: number;
}
export declare class DDoSProtection {
    private requests;
    private windowMs;
    private maxRequests;
    constructor(options?: RateLimitOptions);
    /**
     * Check if a request is allowed based on rate limiting
     * @param key Unique identifier (e.g., IP address, user ID)
     * @returns true if allowed, false if rate limited
     */
    isAllowed(key: string): boolean;
    /**
     * Get current request count for a key
     * @param key Unique identifier
     * @returns number of requests in current window
     */
    getRequestCount(key: string): number;
    /**
     * Clear all stored request data
     */
    clear(): void;
    /**
     * Remove expired entries to free memory
     */
    cleanup(): void;
}
export declare const defaultDDoSProtection: DDoSProtection;
