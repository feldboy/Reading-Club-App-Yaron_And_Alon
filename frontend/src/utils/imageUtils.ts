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


/**
 * A reliable inline SVG data URI for a default user avatar.
 * Prevents 404 infinite loops in onError handlers.
 */
export const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackUrl: string = DEFAULT_AVATAR) => {
    const target = e.currentTarget;
    if (target.src !== fallbackUrl) {
        target.onerror = null;
        target.src = fallbackUrl;
    }
};

/**
 * A beautiful default book cover image for missing covers.
 */
export const DEFAULT_BOOK_COVER = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop";

export const handleBookImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    handleImageError(e, DEFAULT_BOOK_COVER);
};
