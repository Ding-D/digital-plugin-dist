/**
 * Frontend Security Utility
 * Provides protection against common frontend attacks like XSS, CSRF, etc.
 */
export interface SanitizeOptions {
    allowedTags?: string[];
    allowedAttributes?: string[];
}
export interface FrontendSecurityConfig {
    maxInputLength?: number;
    allowedTags?: string[];
    allowedAttributes?: string[];
}
/**
 * FrontendSecurity class for comprehensive security utilities
 */
declare class FrontendSecurity {
    private config;
    constructor(config?: FrontendSecurityConfig);
    /**
     * Sanitize HTML content
     */
    sanitizeHtml(html: string, options?: SanitizeOptions): string;
    /**
     * Clean rich text content
     */
    cleanRichText(html: string): string;
    /**
     * Validate and sanitize user input
     */
    validateInput(input: string): string | null;
    /**
     * Generate CSRF token
     */
    generateCSRFToken(): string;
    /**
     * Validate CSRF token
     */
    validateCSRFToken(token: string, expectedToken: string): boolean;
    /**
     * Get security headers
     */
    getSecurityHeaders(): Record<string, string>;
    /**
     * Check if URL is safe
     */
    isSafeUrl(url: string): boolean;
    /**
     * Escape HTML attribute
     */
    escapeHtmlAttribute(str: string): string;
}
/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html Raw HTML string
 * @param options Sanitization options
 * @returns Sanitized HTML string
 */
export declare function sanitizeHtml(html: string, options?: SanitizeOptions): string;
/**
 * Clean rich text content by removing potentially dangerous elements
 * Allows common formatting tags but removes scripts, styles, and other risky elements
 * @param html Rich text HTML string
 * @returns Cleaned HTML string
 */
export declare function cleanRichText(html: string): string;
/**
 * Validate and sanitize user input
 * @param input User input string
 * @param maxLength Maximum allowed length
 * @returns Sanitized input or null if invalid
 */
export declare function validateInput(input: string, maxLength?: number): string | null;
/**
 * Generate CSRF token
 * @returns Random CSRF token string
 */
export declare function generateCSRFToken(): string;
/**
 * Validate CSRF token
 * @param token Token to validate
 * @param expectedToken Expected token
 * @returns true if valid
 */
export declare function validateCSRFToken(token: string, expectedToken: string): boolean;
/**
 * Prevent clickjacking by setting X-Frame-Options equivalent in headers
 * Note: This is for server-side usage, client-side equivalent would be CSP
 */
export declare function getSecurityHeaders(): Record<string, string>;
/**
 * Check if URL is safe (basic validation)
 * @param url URL string
 * @returns true if URL appears safe
 */
export declare function isSafeUrl(url: string): boolean;
/**
 * Escape string for use in HTML attributes
 * @param str String to escape
 * @returns Escaped string
 */
export declare function escapeHtmlAttribute(str: string): string;
/**
 * Content Security Policy helper
 */
export declare class CSPBuilder {
    private directives;
    addDirective(directive: string, values: string[]): this;
    build(): string;
}
export declare const defaultCSP: CSPBuilder;
export declare const defaultFrontendSecurity: FrontendSecurity;
export default FrontendSecurity;
