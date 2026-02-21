import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchBooks, type Book } from '../../services/books.api';

/**
 * Premium Book Cover Placeholder
 * Beautiful gradient with centered title for missing images
 */
const BookPlaceholder = ({ title }: { title: string }) => (
    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1025] via-[#0f0a15] to-[#0a0510] flex items-center justify-center p-4">
        <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
        </div>
        <h3 className="font-display font-bold text-lg text-white/90 text-center leading-snug line-clamp-4 relative z-10">
            {title}
        </h3>
    </div>
);

/**
 * Top Books Carousel Component
 * $1M Premium design with 3D effects and colored shadows
 */
export default function TopBooksCarousel() {
    const navigate = useNavigate();
    const [topBooks, setTopBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchTopBooks = async () => {
            try {
                setLoading(true);
                setError(null);

                const PREMIUM_QUERIES = [
                    'intitle:"The Midnight Library" inauthor:"Matt Haig"',
                    'intitle:"Project Hail Mary" inauthor:"Andy Weir"',
                    'intitle:"Fourth Wing" inauthor:"Rebecca Yarros"',
                    'intitle:"Lessons in Chemistry" inauthor:"Bonnie Garmus"',
                    'intitle:"Dune" inauthor:"Frank Herbert"',
                    'intitle:"Tomorrow, and Tomorrow, and Tomorrow" inauthor:"Gabrielle Zevin"',
                ];

                const promises = PREMIUM_QUERIES.map(q => searchBooks(q));
                const results = await Promise.all(promises);

                const validBooks = results
                    .map(booksSet => booksSet.find(b => b.cover && b.cover.trim() !== ''))
                    .filter((book): book is Book => book !== undefined);

                if (validBooks.length < 6) {
                    const fallbackBooks = await searchBooks('subject:"epic fantasy" OR subject:"science fiction"');
                    const needed = 6 - validBooks.length;
                    const extras = fallbackBooks
                        .filter(b => b.cover && b.cover.trim() !== '' && !validBooks.some(v => v.id === b.id))
                        .slice(0, needed);
                    validBooks.push(...extras);
                }

                setTopBooks(validBooks.slice(0, 6));
            } catch (err: any) {
                console.error('Failed to load top books:', err);
                setError(err.message || 'Failed to load top books');
            } finally {
                setLoading(false);
            }
        };

        fetchTopBooks();
    }, []);

    const handleBookClick = (book: Book) => {
        navigate(`/books/${book.id}`);
    };

    if (loading) {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-10">
                {/* Premium skeleton loader */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="h-8 w-48 bg-white/5 rounded-lg skeleton-wave" />
                </div>
                <div className="flex gap-5 overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="shrink-0 w-[160px] sm:w-[180px]"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="aspect-[2/3] rounded-2xl bg-white/5 skeleton-wave" />
                            <div className="mt-4 space-y-2">
                                <div className="h-5 bg-white/5 rounded skeleton-wave" />
                                <div className="h-4 w-2/3 bg-white/5 rounded skeleton-wave" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error || topBooks.length === 0) {
        return null;
    }

    return (
        <section className="px-4 sm:px-6 lg:px-8 pt-10 pb-4">
            {/* Section header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold leading-tight tracking-tight">
                        Popular Books
                    </h2>
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/20 text-xs font-bold text-primary-glow uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--color-primary)]" />
                        Trending
                    </span>
                </div>
            </div>

            {/* Premium 3D Carousel */}
            <div className="overflow-x-auto no-scrollbar md:overflow-visible -mx-4 px-4">
                <div className="flex items-stretch gap-5 sm:gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 py-6">
                    {topBooks.map((book, index) => (
                        <button
                            key={book.id}
                            onClick={() => handleBookClick(book)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="flex flex-col min-w-[160px] sm:min-w-[180px] md:min-w-0 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background-dark rounded-2xl text-left transition-transform duration-500"
                            style={{
                                transform: hoveredIndex === index ? 'scale(1.02)' : 'scale(1)',
                            }}
                        >
                            {/* Book Cover with 3D tilt and colored shadow */}
                            <div
                                className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                                style={{
                                    transform: hoveredIndex === index
                                        ? 'perspective(1000px) rotateY(0deg) rotateX(0deg)'
                                        : `perspective(1000px) rotateY(${index % 2 === 0 ? -3 : 3}deg) rotateX(2deg)`,
                                    boxShadow: hoveredIndex === index
                                        ? '0 40px 80px -20px rgba(0,0,0,0.8), 0 0 60px -10px rgba(139,92,246,0.4), 0 0 100px -20px rgba(139,92,246,0.2)'
                                        : '0 25px 50px -15px rgba(0,0,0,0.7), 0 0 40px -15px rgba(139,92,246,0.2)',
                                }}
                            >
                                {/* Border gradient overlay */}
                                <div className="absolute inset-0 rounded-2xl border border-white/[0.08] z-10 pointer-events-none" />

                                {book.cover && book.cover !== '' ? (
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url("${book.cover}")` }}
                                        role="img"
                                        aria-label={`${book.title} book cover`}
                                    />
                                ) : (
                                    <BookPlaceholder title={book.title} />
                                )}

                                {/* Premium glare effect */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.15] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                />

                                {/* Bottom fade for depth */}
                                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                            </div>

                            {/* Book Info */}
                            <div className="mt-4 px-1">
                                <p className="text-white text-base sm:text-lg font-heading font-bold leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2 tracking-tight">
                                    {book.title}
                                </p>
                                <p className="text-white/50 text-sm font-display italic mt-1.5 line-clamp-1">
                                    {book.author}
                                </p>

                                {/* Rating badge */}
                                <div className="flex items-center gap-3 mt-3">
                                    {book.rating > 0 && (
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                                            <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="text-white text-xs font-semibold">
                                                {book.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                    {book.reviewCount > 0 && (
                                        <span className="text-white/40 text-xs font-medium">
                                            {book.reviewCount} reviews
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
