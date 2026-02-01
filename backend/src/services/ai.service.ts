import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Simple in-memory cache for AI responses (5 minutes TTL)
interface CacheEntry {
    data: any;
    timestamp: number;
}

const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Rate limiting state
interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_REQUESTS_PER_MINUTE = 50;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

/**
 * Check if user has exceeded rate limit
 */
function checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(userId);

    if (!entry || now > entry.resetTime) {
        // Reset or create new entry
        rateLimitMap.set(userId, {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW
        });
        return true;
    }

    if (entry.count >= MAX_REQUESTS_PER_MINUTE) {
        return false; // Rate limit exceeded
    }

    entry.count++;
    return true;
}

/**
 * Get cached response if available and not expired
 */
function getCachedResponse(key: string): any | null {
    const entry = responseCache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > CACHE_TTL) {
        responseCache.delete(key);
        return null;
    }

    return entry.data;
}

/**
 * Cache a response
 */
function cacheResponse(key: string, data: any): void {
    responseCache.set(key, {
        data,
        timestamp: Date.now()
    });
}

/**
 * Search for books using AI
 * @param query - User's search query (e.g., "sci-fi books about space")
 * @param userId - User ID for rate limiting
 * @returns Array of book recommendations with title, author, description
 */
export async function searchBooks(query: string, userId: string): Promise<any> {
    // Check rate limit
    if (!checkRateLimit(userId)) {
        throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Check cache
    const cacheKey = `search:${query.toLowerCase()}`;
    const cached = getCachedResponse(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const prompt = `You are a book recommendation assistant. Based on the following query, suggest 5 relevant books.
Query: "${query}"

For each book, provide:
1. Title
2. Author
3. Brief description (2-3 sentences)
4. Genre
5. Why it matches the query

Format your response as a JSON array of objects with keys: title, author, description, genre, matchReason.
Only return the JSON array, no additional text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the JSON response
        let books;
        try {
            // Remove markdown code blocks if present
            const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            books = JSON.parse(jsonText);
        } catch (parseError) {
            console.error('Failed to parse AI response:', text);
            throw new Error('Failed to parse AI response');
        }

        const result_data = {
            query,
            books,
            timestamp: new Date().toISOString()
        };

        // Cache the result
        cacheResponse(cacheKey, result_data);

        return result_data;
    } catch (error: any) {
        console.error('AI searchBooks error:', error);
        throw new Error(`AI search failed: ${error.message}`);
    }
}

/**
 * Get personalized book recommendations based on user preferences
 * @param preferences - User preferences (genres, favorite books, reading goals)
 * @param userId - User ID for rate limiting
 * @returns Personalized book recommendations
 */
export async function getRecommendations(
    preferences: {
        genres?: string[];
        favoriteBooks?: string[];
        readingGoals?: string;
        recentlyRead?: string[];
    },
    userId: string
): Promise<any> {
    // Check rate limit
    if (!checkRateLimit(userId)) {
        throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Create cache key from preferences
    const cacheKey = `recommendations:${JSON.stringify(preferences)}`;
    const cached = getCachedResponse(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const prompt = `You are a personalized book recommendation engine. Based on the user's preferences below, suggest 8 books they would enjoy.

User Preferences:
${preferences.genres ? `Favorite Genres: ${preferences.genres.join(', ')}` : ''}
${preferences.favoriteBooks ? `Favorite Books: ${preferences.favoriteBooks.join(', ')}` : ''}
${preferences.readingGoals ? `Reading Goals: ${preferences.readingGoals}` : ''}
${preferences.recentlyRead ? `Recently Read: ${preferences.recentlyRead.join(', ')}` : ''}

For each book, provide:
1. Title
2. Author
3. Description (2-3 sentences)
4. Genre
5. Why this matches the user's preferences (be specific)
6. Similarity score (0-100) based on how well it matches their preferences

Format your response as a JSON array of objects with keys: title, author, description, genre, matchReason, similarityScore.
Only return the JSON array, no additional text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the JSON response
        let recommendations;
        try {
            const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            recommendations = JSON.parse(jsonText);
        } catch (parseError) {
            console.error('Failed to parse AI response:', text);
            throw new Error('Failed to parse AI response');
        }

        const result_data = {
            preferences,
            recommendations,
            timestamp: new Date().toISOString()
        };

        // Cache the result
        cacheResponse(cacheKey, result_data);

        return result_data;
    } catch (error: any) {
        console.error('AI getRecommendations error:', error);
        throw new Error(`AI recommendations failed: ${error.message}`);
    }
}

/**
 * Clear expired cache entries (can be called periodically)
 */
export function clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of responseCache.entries()) {
        if (now - entry.timestamp > CACHE_TTL) {
            responseCache.delete(key);
        }
    }
}
