/**
 * Utility functions for handling images
 */

/**
 * Transforms a Google Books image URL to request a higher resolution version.
 * 
 * Google Books API returns thumbnails with "&zoom=1".
 * We remove this parameter and add "&fife=w800" to get a higher quality image.
 * We also ensure the URL uses HTTPS.
 * 
 * @param url The original image URL
 * @returns The transformed high-resolution image URL
 */
export const getHighResBookCover = (url?: string): string => {
    if (!url) return '';

    // Ensure HTTPS
    let highResUrl = url.replace('http:', 'https:');

    // Remove zoom parameter if present
    highResUrl = highResUrl.replace('&zoom=1', '');

    // Add fife parameter for higher resolution if not already present
    // w800 requests an image with width 800px
    if (!highResUrl.includes('&fife=')) {
        highResUrl += '&fife=w800';
    }

    return highResUrl;
};

/**
 * Resolves an internal image path (like /uploads/...) to a full URL based on the environment.
 * In development, points to localhost:3000. In production, uses relative path (proxied by Nginx) or VITE_API_URL.
 */
export const resolveInternalImageUrl = (path?: string): string => {
    if (!path) return '';
    if (path.startsWith('http')) return path; // Already a full URL

    // Ensure path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    const backendUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '');
    return `${backendUrl}${normalizedPath}`;
};
