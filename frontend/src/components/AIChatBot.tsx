import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatWithAI } from '../services/ai.api';
import type { ChatMessage } from '../services/ai.api';
import { useAuth } from '../context/AuthContext';
import { searchBooks } from '../services/books.api';

interface DisplayMessage {
    role: 'user' | 'model';
    content: string;
}

export default function AIChatBot() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [navigatingBook, setNavigatingBook] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    /**
     * Navigate to a book's detail page
     */
    const handleBookClick = async (bookTitle: string, author?: string) => {
        setNavigatingBook(bookTitle);
        try {
            const query = author ? `${bookTitle} ${author}` : bookTitle;
            const results = await searchBooks(query);
            if (results.length > 0) {
                setIsOpen(false);
                navigate(`/books/${results[0].id}`);
            }
        } catch (error) {
            console.error('Failed to find book:', error);
        } finally {
            setNavigatingBook(null);
        }
    };

    /**
     * Parse message content and make book titles clickable
     * Looks for patterns like: "Book Title" by Author
     */
    const renderMessageWithLinks = (content: string) => {
        // Pattern to match: "Book Title" by Author (English format)
        const bookPattern = /"([^"]+)"\s+by\s+([^,\n.]+)/gi;

        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        let match;

        while ((match = bookPattern.exec(content)) !== null) {
            // Add text before the match
            if (match.index > lastIndex) {
                parts.push(content.slice(lastIndex, match.index));
            }

            const bookTitle = match[1];
            const author = match[2]?.trim();

            parts.push(
                <button
                    key={match.index}
                    onClick={() => handleBookClick(bookTitle, author)}
                    disabled={navigatingBook === bookTitle}
                    className="inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 font-medium transition-all cursor-pointer border border-purple-500/30 disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-sm">book_2</span>
                    {bookTitle}
                    {navigatingBook === bookTitle && (
                        <span className="size-3 border border-purple-300 border-t-transparent rounded-full animate-spin" />
                    )}
                </button>
            );

            // Add the "by Author" part as regular text
            parts.push(` by ${author}`);

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < content.length) {
            parts.push(content.slice(lastIndex));
        }

        return parts.length > 0 ? parts : content;
    };

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    if (!isAuthenticated) return null;

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        // Add user message to display immediately
        setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await chatWithAI(trimmed, history);
            setMessages((prev) => [...prev, { role: 'model', content: result.reply }]);
            setHistory(result.history);
        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || 'Error communicating with AI. Please try again.';
            setMessages((prev) => [...prev, { role: 'model', content: `❌ ${errorMsg}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 right-4 z-[200] md:bottom-8 md:right-8 size-14 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] text-white shadow-xl shadow-purple-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden p-0"
                    aria-label="Open AI Book Assistant chat"
                >
                    <img
                        src="/ai-robot.png"
                        alt="AI Book Assistant"
                        className="w-full h-full object-cover"
                    />
                </button>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed inset-0 z-[300] md:inset-auto md:bottom-28 md:right-8 md:w-[460px] md:h-[600px] md:rounded-3xl md:shadow-2xl md:shadow-purple-500/20 flex flex-col bg-[#1a0f2e] border border-purple-500/20 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#7C3AED]/20 to-[#A78BFA]/10 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#A78BFA] text-2xl" aria-hidden="true">
                                smart_toy
                            </span>
                            <div>
                                <h2 className="text-white font-bold text-base">AI Book Assistant</h2>
                                <p className="text-purple-300/60 text-xs">Find your perfect book</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="size-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Close chat"
                        >
                            <span className="material-symbols-outlined text-purple-300 text-xl" aria-hidden="true">
                                close
                            </span>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-4">
                                <span className="material-symbols-outlined text-purple-400/40 text-6xl" aria-hidden="true">
                                    auto_stories
                                </span>
                                <p className="text-purple-300/60 text-sm leading-relaxed">
                                    Hello! 👋 I'm your book assistant.
                                    <br />
                                    Tell me what you'd like to read!
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center mt-2">
                                    {[
                                        'Thriller with humor 🔥',
                                        'Fantasy for beginners ✨',
                                        'Short sci-fi book 🚀',
                                    ].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => {
                                                setInput(suggestion);
                                                inputRef.current?.focus();
                                            }}
                                            className="px-3 py-1.5 rounded-full bg-[#7C3AED]/15 text-purple-300 text-xs hover:bg-[#7C3AED]/25 transition-colors border border-purple-500/20 cursor-pointer"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                        ? 'bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] text-white rounded-br-md'
                                        : 'bg-white/8 text-purple-100 border border-white/5 rounded-bl-md'
                                        }`}
                                >
                                    {msg.role === 'model' ? renderMessageWithLinks(msg.content) : msg.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/8 border border-white/5 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                                    <div className="flex gap-1">
                                        <span className="size-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="size-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="size-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <span className="text-purple-300/60 text-xs">Thinking...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="px-4 py-3 border-t border-white/10 bg-[#1a0f2e]/80 backdrop-blur-sm">
                        <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-2 border border-white/10 focus-within:border-[#7C3AED]/50 transition-colors">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask me about books..."
                                disabled={isLoading}
                                className="flex-1 bg-transparent text-white text-sm placeholder:text-purple-300/40 outline-none disabled:opacity-50"
                                dir="auto"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="size-9 rounded-full bg-[#7C3AED] text-white flex items-center justify-center hover:bg-[#6D28D9] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer active:scale-90"
                                aria-label="Send message"
                            >
                                <span className="material-symbols-outlined text-lg" aria-hidden="true">
                                    send
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
