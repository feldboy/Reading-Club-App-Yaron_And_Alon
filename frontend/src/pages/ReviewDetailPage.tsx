import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReviewDetailPage() {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [comment, setComment] = useState('');

    return (
        <div className="bg-background-light dark:bg-background-dark font-serif text-slate-900 dark:text-slate-100 selection:bg-primary/30 min-h-screen">
            {/* Context Header */}
            <nav className="sticky top-0 z-50 glass border-x-0 border-t-0 p-4 transition-all flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="size-10 rounded-full glass flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-primary font-display font-bold text-xs tracking-widest uppercase">The Quantum Club</span>
                    <span className="text-sm font-medium tracking-widest uppercase opacity-70">Editorial</span>
                </div>
                <div className="flex items-center gap-4">
                    <span
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        className={`material-symbols-outlined cursor-pointer hover:text-primary transition-all active:scale-90 ${isBookmarked ? 'text-primary' : 'text-white'}`}
                        style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}
                    >
                        bookmark
                    </span>
                    <span className="material-symbols-outlined text-white cursor-pointer hover:text-primary transition-colors">more_vert</span>
                </div>
            </nav>

            {/* Side Floating Actions (Desktop) */}
            <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 p-2 glass rounded-full items-center hidden md:flex">
                <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="flex flex-col items-center group"
                >
                    <div className={`p-3 rounded-full transition-all shadow-[0_0_15px_rgba(164,19,236,0.3)] active:scale-90 ${isLiked ? 'bg-primary text-white' : 'bg-primary/20 text-primary'}`}>
                        <span className="material-symbols-outlined !text-[20px]" style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                    </div>
                    <span className="text-[10px] mt-1 font-bold">{isLiked ? '1.3k' : '1.2k'}</span>
                </button>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                    }}
                    className="flex flex-col items-center group"
                >
                    <div className="p-3 rounded-full glass text-white group-active:scale-95 transition-all hover:bg-white/10">
                        <span className="material-symbols-outlined !text-[20px]">share</span>
                    </div>
                    <span className="text-[10px] mt-1 font-bold">Share</span>
                </button>
            </div>

            <main className="max-w-screen-md mx-auto px-6 py-12 md:py-24">
                {/* Book Meta Section */}
                <header className="mb-16">
                    <div className="flex items-start gap-8">
                        <div className="w-32 md:w-48 aspect-[2/3] rounded-xl shadow-2xl overflow-hidden glass group cursor-pointer">
                            <img alt="Book cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtzBppcQA2KqE2fjkn6Zsv6nuhkr3UxZwipQZnGdsHssFpJ_5PtdXbu0Jd9xVifEshnvil0PFVISLdwHg6W4BxNABc4bven1-0I1CkZp2wzJW0__LU-kAHhDbDeiMSM7hvas36ikfkLmuYhF1O1Tyoyc7CFzmnfjxdlIUkrxz7r2Kc8ZsY0t4K76lQAIqndsXOmtu7r-O8bj99XoXAxxSq4u9raA08AHInLAdBB8NfDPGRVOnY1iz25CXDtiL1SjjO05DAGOkvs3Y" />
                        </div>
                        <div className="flex-1 space-y-4 pt-2">
                            <h1 className="text-4xl md:text-5xl font-bold font-display leading-[1.1] text-white">Project Hail Mary</h1>
                            <p className="text-xl md:text-2xl text-slate-400">Andy Weir</p>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-primary border border-primary/20">Hard Science Fiction</span>
                                <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-slate-400 border border-white/10 italic">2021</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mb-12">
                    <div className="glass rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden">
                                <img alt="Reviewer profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4eG1bhcz0NxGVkxlw17URVKPPy5YukBRdCExihVoaPrcVqU6--5BCIxUNzL6hH21dEPgKUlGgTHX1PrnIXzFh3rbiA1_wb-awMXov_KUkkiLxXc6cb1KDEf0cOLLB2GzZHw0xajnYk8JP8iomMyZ_RY-syieNgiXhmTUDQMPaG7ItjuYoWBf9hQ06rO1fNN6gHtsPgjz4pZn5F8qVJ0Cd03CDqblrqyTsnoK5Dt8QPdFXyCabnr9crWzKmdhwUyjnWQPtIIcbGr4" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base">Sarah Jenkins</h4>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-[0.05em]">Top Contributor • 2 min read</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsFollowing(!isFollowing)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 ${isFollowing ? 'bg-white/10 text-white border border-white/20' : 'bg-primary hover:bg-primary/90 text-white'}`}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    </div>
                </div>

                {/* Review Body */}
                <article className="prose prose-invert prose-lg max-w-none space-y-8 text-slate-300 leading-relaxed">
                    <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left pt-2">
                        Project Hail Mary is quite possibly the most enjoyable science fiction novel I have read in the last decade.
                        Andy Weir has managed to recapture the lightning in a bottle that was <em className="text-white italic">The Martian</em>,
                        but this time on an interstellar scale with stakes that encompass the entire human race.
                    </p>

                    <blockquote className="border-l-4 border-primary pl-8 my-12 italic text-2xl font-display text-white">
                        "If you're not learning, you're not living. If you're not living, you're not doing anything worth doing."
                    </blockquote>

                    <p>
                        The core of the book lies in its scientific problem-solving. Ryland Grace, our protagonist,
                        wakes up on a spaceship with no memory of how he got there or even his own name.
                        The process of him using basic physics and chemistry experiments to determine his situation
                        is pure Weir at his best. It's an ode to the scientific method where being smart is the ultimate superpower.
                    </p>

                    <h2 className="text-3xl font-display font-bold text-white mb-6">A New Kind of Dynamic</h2>
                    <p>
                        Without giving too much away, the introduction of a secondary character mid-way through
                        transforms the novel from a lone-survivor story into a beautiful exploration of communication,
                        friendship, and altruism. The dynamic between them is incredibly heartwarming and provides
                        the emotional weight that balances the heavy technical details.
                    </p>

                    <p>
                        The "science" is accessible but rigorous enough to feel grounded. You'll finish the book
                        feeling like you've actually learned about orbital mechanics and cellular biology,
                        all while having a blast.
                    </p>
                </article>

                <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
                    <div className="flex -space-x-3 items-center">
                        <div className="w-8 h-8 rounded-full border-2 border-[#1a1a2e] overflow-hidden bg-slate-800"></div>
                        <div className="w-8 h-8 rounded-full border-2 border-[#1a1a2e] overflow-hidden bg-slate-700"></div>
                        <div className="w-8 h-8 rounded-full border-2 border-[#1a1a2e] overflow-hidden bg-slate-600"></div>
                        <span className="pl-6 text-sm text-slate-500 font-medium">Liked by 1,234 others</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-3 glass rounded-xl text-white hover:bg-white/10 active:scale-95 transition-all">
                            <span className="material-symbols-outlined">sentiment_very_satisfied</span>
                        </button>
                        <button className="p-3 glass rounded-xl text-white hover:bg-white/10 active:scale-95 transition-all">
                            <span className="material-symbols-outlined">ios_share</span>
                        </button>
                    </div>
                </div>

                <section className="mt-24 space-y-8 pb-32">
                    <h3 className="text-2xl font-display font-bold text-white">Join the Discussion</h3>
                    <div className="space-y-6">
                        {/* Mock comments */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                                <span className="font-bold text-xs uppercase">ML</span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-bold text-sm">Marcus Lane</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">3h ago</span>
                                </div>
                                <p className="text-slate-400 text-sm italic leading-snug">"Rocky is the best character in fiction since R2-D2. Fist-my-bump!"</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Bottom Input Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 glass border-x-0 border-b-0 z-50 mb-[60px] md:mb-0">
                <div className="max-w-2xl mx-auto flex items-center gap-3">
                    <div className="flex-1 bg-white/5 rounded-full px-4 py-2 flex items-center gap-2 border border-white/10 focus-within:border-primary/50 transition-colors">
                        <span className="material-symbols-outlined text-white/40" style={{ fontSize: '20px' }}>edit</span>
                        <input
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && setComment('')}
                            className="bg-transparent border-none focus:ring-0 text-sm w-full text-white placeholder:text-white/30"
                            placeholder="Add to the discussion..."
                            type="text"
                        />
                    </div>
                    <button
                        onClick={() => setComment('')}
                        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
