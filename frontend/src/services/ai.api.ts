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
        userProfile: {
            genres: string[];
            favoriteBooks: string[];
            wishlistBooks: string[];
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
 * Search for books using AI
 */
export const searchBooks = async (query: string): Promise<AIBook[]> => {
    const response = await api.post<AISearchResponse>('/ai/search', { query });
    return response.data.data.books;
};

/**
 * Get personalized book recommendations based on database history
 */
export const getRecommendations = async (): Promise<AIBook[]> => {
    const response = await api.get<AIRecommendationsResponse>('/ai/recommend');
    return response.data.data.recommendations;
};



/**
 * Chat Message for multi-turn AI conversation
 */
export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

/**
 * AI Chat Response
 */
export interface AIChatResponse {
    success: boolean;
    data: {
        reply: string;
        history: ChatMessage[];
    };
}

/**
 * Chat with the AI Book Assistant
 */
export const chatWithAI = async (
    message: string,
    history: ChatMessage[] = []
): Promise<{ reply: string; history: ChatMessage[] }> => {
    const response = await api.post<AIChatResponse>('/ai/chat', { message, history });
    return response.data.data;
};
