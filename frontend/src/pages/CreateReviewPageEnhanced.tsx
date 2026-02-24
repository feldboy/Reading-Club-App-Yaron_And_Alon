import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDebounce } from '../hooks';
import { searchBooks, type Book } from '../services/books.api';
import { createReview } from '../services/review.api';
import type { AIBook } from '../services/ai.api';

const REVIEW_TAGS = ['Must Read', 'Page Turner', 'Thought Provoking', 'Character Driven', 'Plot Twist', 'Emotional', 'Funny', 'Dark', 'Inspiring', 'Nostalgic'];

const MIN_REVIEW_LENGTH = 50;
const MAX_REVIEW_LENGTH = 5000;

export default function CreateReviewPageEnhanced() {
    const navigate = useNavigate();
    const location = useLocation();

    // Multi-step flow
    const [currentStep, setCurrentStep] = useState<'book' | 'rating' | 'review' | 'details'>('book');

    // Form state
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isPublic, setIsPublic] = useState(true);

    // Book search state
    const [selectedBook, setSelectedBook] = useState<Partial<Book> | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const searchRef = useRef<HTMLDivElement>(null);
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Image upload state
    const [reviewImage, setReviewImage] = useState<File | null>(null);
    const [reviewImagePreview, setReviewImagePreview] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Handle AI book selection from navigation state
    useEffect(() => {
        const aiBook = (location.state as any)?.selectedBook as AIBook | undefined;
        if (aiBook) {
            setSelectedBook({
                title: aiBook.title,
                author: aiBook.author,
                cover: '',
                id: undefined,
            });
            setCurrentStep('rating');
        }
    }, [location.state]);

    // Handle outside click to close results
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search effect
    useEffect(() => {
        const performSearch = async () => {
            if (!debouncedSearch.trim()) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const results = await searchBooks(debouncedSearch);
                setSearchResults(results);
                setShowResults(true);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setIsSearching(false);
            }
        };

        performSearch();
    }, [debouncedSearch]);

    const handleSelectBook = (book: Book) => {
        setSelectedBook(book);
        setSearchQuery('');
        setShowResults(false);
        setSearchResults([]);
        setCurrentStep('rating');
    };

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleImageUpload = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be smaller than 5MB');
            return;
        }
        setReviewImage(file);
        const reader = new FileReader();
        reader.onload = (e) => setReviewImagePreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleImageUpload(file);
    };

    const handleRemoveImage = () => {
        setReviewImage(null);
        setReviewImagePreview(null);
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    const handleSubmit = async () => {
        if (!selectedBook?.title || !selectedBook?.author) {
            setError('Please select a book');
            return;
        }

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        if (reviewText.length < MIN_REVIEW_LENGTH) {
            setError(`Review must be at least ${MIN_REVIEW_LENGTH} characters`);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await createReview({
                bookTitle: selectedBook.title,
                bookAuthor: selectedBook.author,
                bookImage: selectedBook.cover || undefined,   // Google Books cover URL
                bookISBN: selectedBook.id || undefined,
                googleBookId: selectedBook.id || undefined,
                rating,
                reviewText: reviewText.trim(),
                reviewImage: reviewImage instanceof File ? reviewImage : undefined,
            });

            navigate('/');
        } catch (err: any) {
            console.error('Failed to create review:', err);
            setError(err.response?.data?.message || 'Failed to create review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        { id: 'book', label: 'Select Book', icon: 'menu_book' },
        { id: 'rating', label: 'Rate It', icon: 'star' },
        { id: 'review', label: 'Write Review', icon: 'edit_note' },
        { id: 'details', label: 'Add Details', icon: 'tune' },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === currentStep);
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    const canProceed = () => {
        if (currentStep === 'book') return selectedBook !== null;
        if (currentStep === 'rating') return rating > 0;
        if (currentStep === 'review') return reviewText.length >= MIN_REVIEW_LENGTH;
        return true;
    };

    const goToNextStep = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
            setCurrentStep(steps[nextIndex].id as any);
        } else {
            handleSubmit();
        }
    };

    const goToPrevStep = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(steps[prevIndex].id as any);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#FAF5FF] via-[#F3E8FF] to-[#FAF5FF] dark:from-[#1a0f2e] dark:via-[#2d1b4e] dark:to-[#1a0f2e] min-h-screen pb-24">
            {/* Header with Progress */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-[#1a0f2e]/80 border-b border-[#7C3AED]/10 dark:border-white/5 px-4 sm:px-6 py-4 shadow-sm">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={goToPrevStep}
                            className="p-2 hover:bg-[#7C3AED]/10 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                            aria-label="Go back"
                        >
                            <span className="material-symbols-outlined text-[#7C3AED] dark:text-white">arrow_back</span>
                        </button>
                        <h1 className="font-heading text-xl sm:text-2xl font-bold text-[#4C1D95] dark:text-white">
                            Create Review
                        </h1>
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-[#7C3AED]/10 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <span className="material-symbols-outlined text-[#7C3AED] dark:text-white">close</span>
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 bg-[#7C3AED]/10 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Step Indicators */}
                    <div className="flex justify-between mt-4">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`flex flex-col items-center gap-2 transition-all duration-300 ${index <= currentStepIndex ? 'opacity-100' : 'opacity-40'
                                    }`}
                            >
                                <div
                                    className={`size-10 rounded-full flex items-center justify-center transition-all duration-300 ${index < currentStepIndex
                                        ? 'bg-[#22C55E] text-white'
                                        : index === currentStepIndex
                                            ? 'bg-[#7C3AED] text-white scale-110'
                                            : 'bg-[#7C3AED]/10 dark:bg-white/10 text-[#7C3AED] dark:text-white/60'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        {index < currentStepIndex ? 'check' : step.icon}
                                    </span>
                                </div>
                                <span className="text-xs font-medium text-[#4C1D95] dark:text-white hidden sm:block">
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                {/* Step 1: Book Selection */}
                {currentStep === 'book' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#4C1D95] dark:text-white mb-3">
                                Which book did you read?
                            </h2>
                            <p className="text-[#7C3AED] dark:text-white/70 text-base sm:text-lg">
                                Search for a book to get started
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative" ref={searchRef}>
                            <div className="flex items-center gap-3 p-4 bg-white dark:bg-white/5 rounded-2xl border-2 border-[#7C3AED]/20 dark:border-white/10 focus-within:border-[#7C3AED] focus-within:ring-4 focus-within:ring-[#7C3AED]/20 transition-all shadow-lg">
                                <span className="material-symbols-outlined text-2xl text-[#7C3AED] dark:text-white/60">
                                    search
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (e.target.value) setShowResults(true);
                                    }}
                                    placeholder="Search by title, author, or ISBN..."
                                    className="flex-1 bg-transparent border-none outline-none text-[#4C1D95] dark:text-white text-lg placeholder:text-[#7C3AED]/40 dark:placeholder:text-white/40"
                                />
                                {isSearching && (
                                    <div className="size-5 border-2 border-[#7C3AED]/30 border-t-[#7C3AED] rounded-full animate-spin" />
                                )}
                            </div>

                            {/* Search Results */}
                            {showResults && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a0f2e] rounded-2xl border-2 border-[#7C3AED]/20 dark:border-white/10 shadow-2xl overflow-hidden max-h-96 overflow-y-auto z-50 animate-slide-down">
                                    {searchResults.map((book) => (
                                        <button
                                            key={book.id}
                                            onClick={() => handleSelectBook(book)}
                                            className="w-full flex items-center gap-4 p-4 hover:bg-[#7C3AED]/10 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-[#7C3AED]/10 dark:border-white/5 last:border-0 text-left"
                                        >
                                            <img
                                                src={book.cover}
                                                alt={book.title}
                                                className="w-12 h-18 object-cover rounded-lg shadow-md"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-heading font-bold text-[#4C1D95] dark:text-white text-base line-clamp-2">
                                                    {book.title}
                                                </h4>
                                                <p className="text-[#7C3AED] dark:text-white/60 text-sm mt-1">
                                                    {book.author}
                                                </p>
                                            </div>
                                            {book.rating > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[#7C3AED] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                        star
                                                    </span>
                                                    <span className="text-[#4C1D95] dark:text-white text-sm font-bold">
                                                        {book.rating}
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected Book Preview */}
                        {selectedBook && (
                            <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border-2 border-[#7C3AED]/30 dark:border-white/20 shadow-lg animate-scale-in">
                                <div className="flex items-center gap-4">
                                    {selectedBook.cover && (
                                        <img
                                            src={selectedBook.cover}
                                            alt={selectedBook.title}
                                            className="w-20 h-30 object-cover rounded-xl shadow-lg"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-start gap-2 mb-2">
                                            <div className="flex-1">
                                                <h3 className="font-heading font-bold text-[#4C1D95] dark:text-white text-xl mb-1">
                                                    {selectedBook.title}
                                                </h3>
                                                <p className="text-[#7C3AED] dark:text-white/70 text-base">
                                                    by {selectedBook.author}
                                                </p>
                                            </div>
                                            <span className="material-symbols-outlined text-[#22C55E] text-2xl">
                                                check_circle
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Rating */}
                {currentStep === 'rating' && selectedBook && (
                    <div className="animate-fade-in space-y-8">
                        <div className="text-center mb-12">
                            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#4C1D95] dark:text-white mb-3">
                                How would you rate it?
                            </h2>
                            <p className="text-[#7C3AED] dark:text-white/70 text-base sm:text-lg">
                                {selectedBook.title}
                            </p>
                        </div>

                        {/* Star Rating */}
                        <div className="flex flex-col items-center">
                            <div className="flex gap-4 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="group transition-transform hover:scale-125 active:scale-110 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#7C3AED]/30 rounded-full"
                                    >
                                        <span
                                            className={`material-symbols-outlined transition-all duration-300 ${star <= rating
                                                ? 'text-[#7C3AED] scale-125'
                                                : 'text-[#7C3AED]/20 dark:text-white/20'
                                                }`}
                                            style={{
                                                fontSize: '4rem',
                                                fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0",
                                            }}
                                        >
                                            star
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {rating > 0 && (
                                <div className="text-center animate-fade-in">
                                    <p className="text-[#7C3AED] dark:text-white text-3xl font-bold mb-2">
                                        {rating} / 5
                                    </p>
                                    <p className="text-[#4C1D95] dark:text-white/70 text-lg">
                                        {rating === 1 && 'Not for me'}
                                        {rating === 2 && 'It was okay'}
                                        {rating === 3 && 'Liked it'}
                                        {rating === 4 && 'Really liked it'}
                                        {rating === 5 && 'Absolutely loved it!'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 3: Write Review */}
                {currentStep === 'review' && selectedBook && (
                    <div className="animate-fade-in space-y-6">
                        <div className="text-center mb-8">
                            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#4C1D95] dark:text-white mb-3">
                                Share your thoughts
                            </h2>
                            <p className="text-[#7C3AED] dark:text-white/70 text-base sm:text-lg">
                                What did you think about {selectedBook.title}?
                            </p>
                        </div>

                        {/* Text Editor */}
                        <div className="relative">
                            <textarea
                                value={reviewText}
                                onChange={(e) => {
                                    if (e.target.value.length <= MAX_REVIEW_LENGTH) {
                                        setReviewText(e.target.value);
                                    }
                                }}
                                placeholder="Share what you loved, what surprised you, and who you'd recommend this book to..."
                                className="w-full h-64 sm:h-80 p-6 bg-white dark:bg-white/5 rounded-2xl border-2 border-[#7C3AED]/20 dark:border-white/10 focus:border-[#7C3AED] focus:ring-4 focus:ring-[#7C3AED]/20 text-[#4C1D95] dark:text-white text-base leading-relaxed placeholder:text-[#7C3AED]/40 dark:placeholder:text-white/40 resize-none outline-none transition-all shadow-lg"
                            />
                            <div className="absolute bottom-4 right-4 flex items-center gap-3">
                                <span
                                    className={`text-sm font-medium ${reviewText.length < MIN_REVIEW_LENGTH
                                        ? 'text-[#7C3AED]/60 dark:text-white/60'
                                        : 'text-[#22C55E]'
                                        }`}
                                >
                                    {reviewText.length} / {MAX_REVIEW_LENGTH}
                                </span>
                                {reviewText.length >= MIN_REVIEW_LENGTH && (
                                    <span className="material-symbols-outlined text-[#22C55E] text-xl">
                                        check_circle
                                    </span>
                                )}
                            </div>
                        </div>

                        {reviewText.length < MIN_REVIEW_LENGTH && (
                            <p className="text-[#7C3AED] dark:text-white/60 text-sm text-center">
                                {MIN_REVIEW_LENGTH - reviewText.length} more characters needed
                            </p>
                        )}
                    </div>
                )}

                {/* Step 4: Add Details */}
                {currentStep === 'details' && selectedBook && (
                    <div className="animate-fade-in space-y-8">
                        <div className="text-center mb-8">
                            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#4C1D95] dark:text-white mb-3">
                                Add finishing touches
                            </h2>
                            <p className="text-[#7C3AED] dark:text-white/70 text-base sm:text-lg">
                                Help others find your review
                            </p>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-4">
                            <h3 className="font-heading font-bold text-[#4C1D95] dark:text-white text-xl">
                                Add a Photo <span className="text-sm font-normal text-[#7C3AED]/60 dark:text-white/40">(Optional)</span>
                            </h3>

                            {reviewImagePreview ? (
                                <div className="relative group rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src={reviewImagePreview}
                                        alt="Review upload preview"
                                        className="w-full h-56 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={handleRemoveImage}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                            Remove Photo
                                        </button>
                                    </div>
                                    <div className="absolute top-3 right-3 bg-[#22C55E] text-white rounded-full p-1.5 shadow-md">
                                        <span className="material-symbols-outlined text-lg">check</span>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${isDragging
                                        ? 'border-[#7C3AED] bg-[#7C3AED]/10 scale-105'
                                        : 'border-[#7C3AED]/30 dark:border-white/20 hover:border-[#7C3AED] dark:hover:border-white/40 hover:bg-[#7C3AED]/5'
                                        }`}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleImageDrop}
                                    onClick={() => imageInputRef.current?.click()}
                                >
                                    <input
                                        ref={imageInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleImageUpload(file);
                                        }}
                                    />
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="size-16 rounded-full bg-[#7C3AED]/10 dark:bg-white/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-4xl text-[#7C3AED] dark:text-white/60">add_photo_alternate</span>
                                        </div>
                                        <div>
                                            <p className="font-heading font-bold text-[#4C1D95] dark:text-white text-lg">
                                                {isDragging ? 'Drop your image here!' : 'Upload a photo'}
                                            </p>
                                            <p className="text-[#7C3AED]/60 dark:text-white/40 text-sm mt-1">
                                                Drag & drop or click to browse · JPEG, PNG, WebP · Max 5MB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="space-y-4">
                            <h3 className="font-heading font-bold text-[#4C1D95] dark:text-white text-xl">
                                Add Tags (Optional)
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {REVIEW_TAGS.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagToggle(tag)}
                                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${selectedTags.includes(tag)
                                            ? 'bg-[#7C3AED] text-white shadow-lg scale-105'
                                            : 'bg-[#7C3AED]/10 dark:bg-white/5 text-[#7C3AED] dark:text-white hover:bg-[#7C3AED]/20 dark:hover:bg-white/10'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Privacy Toggle */}
                        <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border-2 border-[#7C3AED]/20 dark:border-white/10">
                            <button
                                onClick={() => setIsPublic(!isPublic)}
                                className="w-full flex items-center justify-between cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`size-12 rounded-xl flex items-center justify-center transition-colors ${isPublic
                                            ? 'bg-[#7C3AED]/20 text-[#7C3AED]'
                                            : 'bg-[#7C3AED]/10 dark:bg-white/10 text-[#7C3AED] dark:text-white/60'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-2xl">
                                            {isPublic ? 'public' : 'lock'}
                                        </span>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-heading font-bold text-[#4C1D95] dark:text-white text-lg group-hover:text-[#7C3AED] transition-colors">
                                            {isPublic ? 'Public Review' : 'Private Review'}
                                        </p>
                                        <p className="text-[#7C3AED] dark:text-white/60 text-sm">
                                            {isPublic ? 'Everyone can see this' : 'Only you can see this'}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className={`w-14 h-8 rounded-full relative transition-colors ${isPublic ? 'bg-[#7C3AED]' : 'bg-[#7C3AED]/20 dark:bg-white/20'
                                        }`}
                                >
                                    <div
                                        className={`size-6 bg-white rounded-full absolute top-1 shadow-md transition-all ${isPublic ? 'right-1' : 'left-1'
                                            }`}
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Error Toast */}
            {error && (
                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 bg-red-500 text-white rounded-2xl shadow-2xl animate-slide-down max-w-md">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-2xl">error</span>
                        <p className="font-medium">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-white/80 dark:bg-[#1a0f2e]/80 backdrop-blur-xl border-t border-[#7C3AED]/10 dark:border-white/5 z-40">
                <div className="max-w-4xl mx-auto flex gap-4">
                    {currentStepIndex > 0 && (
                        <button
                            onClick={goToPrevStep}
                            className="px-6 py-4 bg-[#7C3AED]/10 dark:bg-white/5 hover:bg-[#7C3AED]/20 dark:hover:bg-white/10 text-[#7C3AED] dark:text-white rounded-2xl font-bold text-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={goToNextStep}
                        disabled={!canProceed() || isSubmitting}
                        className={`flex-1 px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] flex items-center justify-center gap-2 ${currentStepIndex === steps.length - 1
                            ? 'bg-[#22C55E] hover:bg-[#22C55E]/90 text-white shadow-lg shadow-[#22C55E]/30'
                            : 'bg-[#7C3AED] hover:bg-[#6D31D4] text-white shadow-lg shadow-[#7C3AED]/30'
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Publishing...
                            </>
                        ) : currentStepIndex === steps.length - 1 ? (
                            <>
                                <span className="material-symbols-outlined text-2xl">check</span>
                                Publish Review
                            </>
                        ) : (
                            <>
                                Continue
                                <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
