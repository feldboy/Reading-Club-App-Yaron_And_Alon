import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateReviewPage() {
    const navigate = useNavigate();
    const [rating, setRating] = useState(4);
    const [reviewText, setReviewText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    const handleSubmit = () => {
        if (!reviewText.trim()) {
            alert('Please write a review before submitting.');
            return;
        }
        // Logic to submit review
        console.log('Submitting review', { rating, reviewText, isPublic });
        alert('Review submitted successfully!');
        navigate('/');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen font-display pb-24">
            {/* Header Section with Dynamic Blurred Background */}
            <div className="relative w-full h-[40vh] md:h-[30vh] overflow-hidden">
                {/* Blurred Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-40"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDaYrSzk_7tIIqD8SqfK5WkgG_Dzt9xoXE6fFXjDu08sLDRSO4RkJ3AFNtcOwTeeTJOXuUJfGYiYowasYO9zpd0oBr8Vd1PVHA6PNsewDLo0okVWVajQ20qFovRMCnNce2i6K3mm6hRZozQHOrFuyNEZt50eVCpgfrL37U_yTp_pqnpCsWGAvvU76_tmzGKeqeiyWBAtSbhb78oU1v8YBnI2kiSwgFVONTjsSgUlEn_E9obkXxAnwFcQLJstWkULkCP4tzWjfoa5jI')" }}
                >
                </div>

                <div className="relative z-10 flex items-center p-4 pt-12 justify-between max-w-screen-xl mx-auto w-full">
                    <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full glass-panel cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-white">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-wider uppercase">Create Review</h2>
                    <div className="size-10 flex items-center justify-center rounded-full glass-panel cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-white">more_horiz</span>
                    </div>
                </div>

                {/* Book Selection Area */}
                <div className="relative z-10 flex flex-col items-center mt-4 px-6">
                    {/* Search Bar Component */}
                    <div className="w-full max-w-md px-4 py-3">
                        <label className="flex flex-col min-w-40 h-12 w-full">
                            <div className="flex w-full flex-1 items-stretch rounded-xl h-full glass-panel overflow-hidden">
                                <div className="text-primary flex items-center justify-center pl-4 pr-2">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-none focus:ring-0 border-none bg-transparent placeholder:text-white/40 px-2 text-base font-normal leading-normal"
                                    placeholder="Search for a different book"
                                />
                            </div>
                        </label>
                    </div>
                    {/* Headline and Meta Text */}
                    <div className="text-center mt-2">
                        <h2 className="text-white tracking-tight text-3xl font-bold leading-tight">Project Hail Mary</h2>
                        <p className="text-primary/80 text-sm font-medium leading-normal mt-1 tracking-widest uppercase">Andy Weir</p>
                    </div>
                </div>
            </div>

            {/* Interactive Content Section (Pull-up Feel) */}
            <div className="relative z-20 -mt-16 px-4 max-w-screen-md mx-auto w-full">
                <div className="glass-panel rounded-xl p-6 md:p-10 shadow-2xl space-y-8">
                    {/* Neon Star Rating Section */}
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <span className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">Rating</span>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onClick={() => setRating(star)}>
                                    <span
                                        className={`material-symbols-outlined text-4xl cursor-pointer ${star <= rating ? 'star-active' : 'text-white/20'}`}
                                    >
                                        star
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Glassmorphic Rich Text Editor Area */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">Your Review</span>
                            <div className="flex gap-4 text-white/40">
                                <span className="material-symbols-outlined text-lg cursor-pointer hover:text-primary">format_bold</span>
                                <span className="material-symbols-outlined text-lg cursor-pointer hover:text-primary">format_italic</span>
                                <span className="material-symbols-outlined text-lg cursor-pointer hover:text-primary">format_list_bulleted</span>
                            </div>
                        </div>
                        <div className="w-full min-h-48 rounded-xl bg-white/5 border border-white/10 p-4 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-all">
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="w-full h-full bg-transparent border-none text-white focus:ring-0 p-0 text-base leading-relaxed placeholder:text-white/20 resize-none outline-none"
                                placeholder="Share your cosmic journey through this book..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Image Upload Zone */}
                    <div className="space-y-3">
                        <span className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">Gallery</span>
                        <div className="neon-border-dash w-full h-32 flex flex-col items-center justify-center group cursor-pointer hover:bg-primary/5 transition-colors">
                            <div className="bg-primary/20 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-primary">add_a_photo</span>
                            </div>
                            <p className="text-white/80 text-sm font-medium">Tap to upload photos</p>
                            <p className="text-white/40 text-[10px] mt-1">Maximum 5 photos per review</p>
                        </div>
                    </div>

                    <div
                        onClick={() => setIsPublic(!isPublic)}
                        className="flex items-center justify-between pt-4 border-t border-white/10 cursor-pointer group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`size-8 rounded-full flex items-center justify-center transition-colors ${isPublic ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/40'}`}>
                                <span className="material-symbols-outlined text-sm">{isPublic ? 'public' : 'lock'}</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white transition-colors group-hover:text-primary">{isPublic ? 'Public Review' : 'Private Review'}</p>
                                <p className="text-[10px] text-white/40">{isPublic ? 'Visible to everyone in the club' : 'Only you can see this'}</p>
                            </div>
                        </div>
                        <div className={`w-10 h-6 rounded-full relative transition-colors ${isPublic ? 'bg-primary' : 'bg-white/20'}`}>
                            <div className={`size-4 bg-white rounded-full absolute top-1 shadow-md transition-all ${isPublic ? 'right-1' : 'left-1'}`}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-24 right-6 md:bottom-12 md:right-12 z-50">
                <button
                    onClick={handleSubmit}
                    className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-primary to-[#cc49ff] text-white shadow-[0_0_25px_rgba(164,19,236,0.6)] active:scale-95 transition-all hover:brightness-110 group"
                >
                    <span className="material-symbols-outlined text-3xl md:text-4xl group-hover:rotate-12 transition-transform">send</span>
                </button>
            </div>
        </div>
    );
}
