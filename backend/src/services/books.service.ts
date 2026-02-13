import axios, { AxiosResponse } from 'axios';

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY || '';
const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1';

// Simple cache implementation
interface CacheEntry {
    data: any;
    timestamp: number;
}

const cache: Map<string, CacheEntry> = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Rate limiting
let requestCount = 0;
const RATE_LIMIT = 40; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

setInterval(() => {
    requestCount = 0;
}, RATE_WINDOW);

/**
 * Check if rate limit has been exceeded
 */
const checkRateLimit = (): void => {
    if (requestCount >= RATE_LIMIT) {
        throw new Error('Rate limit exceeded. Please try again later.');
    }
    requestCount++;
};

/**
 * Get cached data if available and not expired
 */
const getCachedData = (key: string): any | null => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    cache.delete(key);
    return null;
};

/**
 * Store data in cache
 */
const setCachedData = (key: string, data: any): void => {
    cache.set(key, {
        data,
        timestamp: Date.now(),
    });
};

export interface BookSearchOptions {
    maxResults?: number;
    startIndex?: number;
    orderBy?: 'relevance' | 'newest';
}

export interface Book {
    id: string;
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
    };
    language?: string;
    averageRating?: number;
    ratingsCount?: number;
}

/**
 * Transform Google Books image URL to high resolution
 */
const getHighResImage = (url?: string): string | undefined => {
    if (!url) return undefined;
    let highResUrl = url.replace('http:', 'https:');
    highResUrl = highResUrl.replace('&zoom=1', '');
    if (!highResUrl.includes('&fife=')) {
        highResUrl += '&fife=w800';
    }
    return highResUrl;
};

/**
 * Search for books
 */
export const searchBooks = async (
    query: string,
    options: BookSearchOptions = {}
): Promise<{ items: Book[]; totalItems: number }> => {
    const {
        maxResults = 10,
        startIndex = 0,
        orderBy = 'relevance',
    } = options;

    // Create cache key
    const cacheKey = `search:${query}:${maxResults}:${startIndex}:${orderBy}`;

    // Check cache
    const cached = getCachedData(cacheKey);
    if (cached) {
        return cached;
    }

    // Check rate limit
    checkRateLimit();

    try {
        const response: AxiosResponse = await axios.get(
            `${GOOGLE_BOOKS_BASE_URL}/volumes`,
            {
                params: {
                    q: query,
                    key: GOOGLE_BOOKS_API_KEY,
                    maxResults,
                    startIndex,
                    orderBy,
                },
            }
        );

        const result = {
            items: response.data.items?.map((item: any) => ({
                id: item.id,
                title: item.volumeInfo?.title,
                authors: item.volumeInfo?.authors,
                publisher: item.volumeInfo?.publisher,
                publishedDate: item.volumeInfo?.publishedDate,
                description: item.volumeInfo?.description,
                pageCount: item.volumeInfo?.pageCount,
                categories: item.volumeInfo?.categories,
                imageLinks: item.volumeInfo?.imageLinks ? {
                    ...item.volumeInfo.imageLinks,
                    thumbnail: getHighResImage(item.volumeInfo.imageLinks.thumbnail),
                    smallThumbnail: getHighResImage(item.volumeInfo.imageLinks.smallThumbnail)
                } : undefined,
                language: item.volumeInfo?.language,
                averageRating: item.volumeInfo?.averageRating,
                ratingsCount: item.volumeInfo?.ratingsCount,
            })) || [],
            totalItems: response.data.totalItems || 0,
        };

        // Cache the result
        setCachedData(cacheKey, result);

        return result;
    } catch (error: any) {
        if (error.response?.status === 429) {
            throw new Error('Google Books API rate limit exceeded');
        }
        throw new Error(error.response?.data?.error?.message || 'Failed to search books');
    }
};

/**
 * Get book details by ID
 */
export const getBookDetails = async (bookId: string): Promise<Book> => {
    // Create cache key
    const cacheKey = `book:${bookId}`;

    // Check cache
    const cached = getCachedData(cacheKey);
    if (cached) {
        return cached;
    }

    // Check rate limit
    checkRateLimit();

    try {
        const response: AxiosResponse = await axios.get(
            `${GOOGLE_BOOKS_BASE_URL}/volumes/${bookId}`,
            {
                params: {
                    key: GOOGLE_BOOKS_API_KEY,
                },
            }
        );

        const item = response.data;
        const result: Book = {
            id: item.id,
            title: item.volumeInfo?.title,
            authors: item.volumeInfo?.authors,
            publisher: item.volumeInfo?.publisher,
            publishedDate: item.volumeInfo?.publishedDate,
            description: item.volumeInfo?.description,
            pageCount: item.volumeInfo?.pageCount,
            categories: item.volumeInfo?.categories,
            imageLinks: item.volumeInfo?.imageLinks ? {
                ...item.volumeInfo.imageLinks,
                thumbnail: getHighResImage(item.volumeInfo.imageLinks.thumbnail),
                smallThumbnail: getHighResImage(item.volumeInfo.imageLinks.smallThumbnail)
            } : undefined,
            language: item.volumeInfo?.language,
            averageRating: item.volumeInfo?.averageRating,
            ratingsCount: item.volumeInfo?.ratingsCount,
        };

        // Cache the result
        setCachedData(cacheKey, result);

        return result;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error('Book not found');
        }
        if (error.response?.status === 429) {
            throw new Error('Google Books API rate limit exceeded');
        }
        throw new Error(error.response?.data?.error?.message || 'Failed to get book details');
    }
};

/**
 * Search books by genre
 */
export const searchBooksByGenre = async (
    genre: string,
    options: BookSearchOptions = {}
): Promise<{ items: Book[]; totalItems: number }> => {
    return searchBooks(`subject:${genre}`, options);
};
