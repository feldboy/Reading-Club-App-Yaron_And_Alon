import api from './api';

/**
 * AI Book Search Result
 */
export interface AIBook {
    title: string;
    author: string;
    description: string;
    genre: string;
    matchReason: string;
    similarityScore?: number;
}

/**
 * AI Search Response
 */
export interface AISearchResponse {
    success: boolean;
    data: {
        query: string;
        books: AIBook[];
        timestamp: string;
    };
}

/**
 * AI Recommendations Response
 */
export interface AIRecommendationsResponse {
    success: boolean;
    data: {
        preferences: {
            genres?: string[];
            favoriteBooks?: string[];
            readingGoals?: string;
            recentlyRead?: string[];
        };
        recommendations: AIBook[];
        timestamp: string;
    };
}

/**
 * AI Search Request
 */
export interface AISearchRequest {
    query: string;
}

/**
 * AI Recommendations Request
 */
export interface AIRecommendationsRequest {
    genres?: string[];
    favoriteBooks?: string[];
    readingGoals?: string;
    recentlyRead?: string[];
}

/**
 * Search for books using AI
 */
export const searchBooks = async (query: string): Promise<AIBook[]> => {
    const response = await api.post<AISearchResponse>('/ai/search', { query });
    return response.data.data.books;
};

/**
 * Get personalized book recommendations
 */
export const getRecommendations = async (
    preferences: AIRecommendationsRequest
): Promise<AIBook[]> => {
    const response = await api.post<AIRecommendationsResponse>('/ai/recommend', preferences);
    return response.data.data.recommendations;
};
