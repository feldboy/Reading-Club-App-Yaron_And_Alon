import axios from 'axios';
import { getHighResBookCover } from '../utils/imageUtils';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

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

export const searchBooks = async (query: string): Promise<Book[]> => {
    try {
        // If query is empty, default to a broad search to fill the page
        const searchTerm = query.trim() || 'subject:fiction';

        const response = await axios.get(`${GOOGLE_BOOKS_API_URL}?q=${searchTerm}&maxResults=20`);

        if (!response.data.items) return [];

        return response.data.items.map((item: any) => {
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
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
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
