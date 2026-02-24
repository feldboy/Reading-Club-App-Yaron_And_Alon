import axios from 'axios';
import { getHighResBookCover } from '../utils/imageUtils';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';
const PAGE_SIZE = 20;

export interface Book {
    id: string;
    title: string;
    author: string;
    cover: string;
    category: string;
    rating: number;
    reviewCount: number;
    description?: string;
}

export interface BooksPage {
    books: Book[];
    totalItems: number;
    hasMore: boolean;
}

/**
 * Search Google Books with pagination support.
 * @param query    Search string (empty → subject:fiction)
 * @param page     1-based page number (default 1)
 * @param orderBy  'relevance' | 'newest' (Google Books API param)
 */
export const searchBooksPage = async (
    query: string,
    page: number = 1,
    orderBy: 'relevance' | 'newest' = 'relevance'
): Promise<BooksPage> => {
    try {
        const searchTerm = query.trim() || 'subject:fiction';
        const startIndex = (page - 1) * PAGE_SIZE;

        const response = await axios.get(GOOGLE_BOOKS_API_URL, {
            params: {
                q: searchTerm,
                maxResults: PAGE_SIZE,
                startIndex,
                orderBy,
                printType: 'books',
            },
        });

        const totalItems: number = response.data.totalItems || 0;

        if (!response.data.items) {
            return { books: [], totalItems, hasMore: false };
        }

        const books: Book[] = response.data.items.map((item: any) => {
            const volumeInfo = item.volumeInfo || {};
            return {
                id: item.id,
                title: volumeInfo.title || 'Untitled',
                author: volumeInfo.authors ? volumeInfo.authors[0] : 'Unknown Author',
                cover: getHighResBookCover(volumeInfo.imageLinks?.thumbnail),
                category: volumeInfo.categories ? volumeInfo.categories[0] : 'General',
                rating: volumeInfo.averageRating || 0,
                reviewCount: volumeInfo.ratingsCount || 0,
                description: volumeInfo.description,
            };
        });

        const hasMore = startIndex + books.length < totalItems;
        return { books, totalItems, hasMore };
    } catch (error) {
        console.error('Error fetching books page:', error);
        return { books: [], totalItems: 0, hasMore: false };
    }
};

/** Legacy helper — kept for backward compatibility with DiscoverPageEnhanced & HomePage */
export const searchBooks = async (query: string): Promise<Book[]> => {
    const result = await searchBooksPage(query, 1, 'relevance');
    return result.books;
};

export const getBookById = async (bookId: string): Promise<Book | null> => {
    try {
        const response = await axios.get(`${GOOGLE_BOOKS_API_URL}/${bookId}`);

        if (!response.data) return null;

        const volumeInfo = response.data.volumeInfo || {};
        return {
            id: response.data.id,
            title: volumeInfo.title || 'Untitled',
            author: volumeInfo.authors ? volumeInfo.authors[0] : 'Unknown Author',
            cover: getHighResBookCover(volumeInfo.imageLinks?.thumbnail),
            category: volumeInfo.categories ? volumeInfo.categories[0] : 'General',
            rating: volumeInfo.averageRating || 0,
            reviewCount: volumeInfo.ratingsCount || 0,
            description: volumeInfo.description,
        };
    } catch (error) {
        console.error('Error fetching book details:', error);
        return null;
    }
};
