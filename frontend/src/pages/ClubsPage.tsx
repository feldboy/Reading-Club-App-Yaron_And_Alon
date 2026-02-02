import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, AvatarGroup, Chip, EmptyState, ClubCardSkeleton } from '../components/ui';
import { useToggle } from '../hooks';

// Mock data for clubs
const MOCK_CLUBS = [
    {
        id: '1',
        name: 'Sci-Fi Explorers',
        description: 'Journey through the cosmos with fellow sci-fi enthusiasts. We read everything from classic Asimov to modern space operas.',
        cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAIzqYqyd-cCio_yZloTImeANixm56uBEggayTiWlRGa5-WRD1wuK2tQORc_2MCu0VaV8kF0Hvfmg2Tm3_NX-5MAYdiyicn-IQg9OBavLCGvH-89wiYbO1KdZG8Iw7rYlwW4_2gDmX9cU2fHNUyDtuG4p-NL_yHndO1W-czu7JyBqfdIEgy3n9ScBXqja3-op7MAyjrgd1tHg8plrEiQ6VOuSn1xCGUgobTsYVikqaXaauWGrTrx1lKIN2oiyvxuYf7DSqfJ8xajo',
        memberCount: 1243,
        currentBook: 'Project Hail Mary',
        category: 'Sci-Fi',
        isJoined: false,
        members: [
            { alt: 'Alex', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxzb13e8e44ZvpqWwmv_INL3ynLBofPysC9bVk1-MR_ae-iYdaji5Joh4Sbz3We2pb67H0eEPI8NizUnqnYW70ws29XRTCm4obQPE9cATx49iu7WQcstRDqbiuisqF4i0z4ummR8Vs6NZHtXk4OEtQS4MZaiugRQKqXAWtUEKYXf6vKcLxSC3XAaI3GMd9OwUWMqSez-lctSbutupR7pzEyMgMznCbFXVWxYon-MIbi60AcBYd8Hi74Fn8oTE8ipnoPdGGZbjID-Q' },
            { alt: 'Sarah', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADZlG018tqvay7iyZdc6DaKQcmDmllSlTQjsN6ss6xo9MzVjDsCQ0TMeas3o8IBCqAOW_gXvTk9gKTO9tfS7AkZ1VUeWkAZtQuhdoDzkhuZxWEdAnn8f1vmAOodQrs88bugUFteO6w1OEk3BV6-DHqJuHzE_9-rFDpeRbHmTmgjHDb3OoJlpis1CfkLXAjqtfGN_XnJV3dVMa0UBgYgONWLPLo-ebQa8JeveMpQCfqzB0-cw-DSlRn5Fa_dCvi9ZHpbmizcB0GMw8' },
            { alt: 'Mike' },
            { alt: 'Lisa' },
            { alt: 'John' }
        ],
        nextMeeting: '2 days'
    },
    {
        id: '2',
        name: 'Fantasy Realm',
        description: 'From epic high fantasy to urban magic, we explore worlds beyond imagination.',
        cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrMI4gvpM06Dn7NUyNGBdK9QeyU8CBa_BG7mOm3ej_yKQfUvNRw6GKniJ7zzrhMLx3Aew95FBbkv1nvmxFeZBBuQ4a35BW28K6ThF8Fp7hTiwEhjx5fk-3zHwcj_CJeKCCHGhV_ARD2GLR0VKtAh5QUt_wnpJkxPIh7cBlPHVNsJzAWUBt0ytkIRUFvUMxgda4YpABYp1fAXK7Vmc1RHpTrDdoljJRzG8Qr1JvjV6fjLUNXZBGdqjPwHDB6FQghS-pjB6cd72a6Yc',
        memberCount: 892,
        currentBook: 'The Fourth Wing',
        category: 'Fantasy',
        isJoined: true,
        members: [
            { alt: 'Emma' },
            { alt: 'Jack' },
            { alt: 'Sophie' }
        ],
        nextMeeting: 'Tomorrow'
    },
    {
        id: '3',
        name: 'Mystery Solvers',
        description: 'Unravel intricate plots and discover whodunit together.',
        cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMjHXPNu7p3OX38iOTwz03ViflbP58NijCag23xc-J_sXn6PUQfvKXzdnDwoK4uPme-9wAL8MrVyFnWE9F9o8tL4YGhv3Q3aV03aigwEZCKs2j8Kc79GPti3NumxpAaAEyzJYlaqI-65d1eLD1GMGpNRHbBcjGAgaEIZz4xpneXSrxpF2ZTYO2An1Dlp7O9Vndx_MZT4kdB8XxXkHj2sZHXs_xL-F0-EehfcdO-IOofElKNlIgqE5VzUNyaTepNld79KO-yuUnmA8',
        memberCount: 567,
        currentBook: 'The Silent Patient',
        category: 'Mystery',
        isJoined: false,
        members: [
            { alt: 'David' },
            { alt: 'Anna' }
        ],
        nextMeeting: '5 days'
    },
    {
        id: '4',
        name: 'Romance Readers',
        description: 'Fall in love with stories that make your heart flutter.',
        cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO6W5qlz7tLks66icc5fkcF7rz9v73VeU-GybzbrEPRb5aeFrcrziXUboEwiZYu6GLcDwEjiB5PN1ZnPxYqI237ZON7953gVIDfbWbUO1UqNXoEluZBu-2vQSxmNwM9BXd41iC7m7CrEJX2T5WTQWm0VmjScicG2SmD2Z3jgbE7qPYtLy2LaBRac-0FZvVHjfKsa8rHWcmkp-b4gEJf9d1sWrtGU9rilR2kXQRh5HtbZc5Ew3x8E6DKxUX0gerNEvRFt1-vOGRVNA',
        memberCount: 1567,
        currentBook: 'It Ends with Us',
        category: 'Romance',
        isJoined: false,
        members: [
            { alt: 'Emily' },
            { alt: 'Rachel' },
            { alt: 'Chris' },
            { alt: 'Laura' }
        ],
        nextMeeting: '3 days'
    },
    {
        id: '5',
        name: 'Non-Fiction Minds',
        description: 'Expand your knowledge with thought-provoking reads.',
        cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdTe2FGoMvuUVSK-gy0NOjrX3ZbbTcXrEMSYOWd9rBSrcC1xD40wkHHbPE1gxsVEPWgOW0KbvGKutg4DTQDMXZeTmHob3mzL47XEhiLqckyjeAy6KVfTRCtKk9WJism7do23TTYuQZNVWP73upZlpA_Ne8xLgxq1AktIgQJNMaewAyolwjr1O-mgKa_CJ6dLLPKoKd4-NoZrkETgGxaGeSWxvxLIolCr24i7Ik0KOzDMoAmv9TyATxckq-kX9NZA4s_JUpbEnQzfE',
        memberCount: 432,
        currentBook: 'Atomic Habits',
        category: 'Non-Fiction',
        isJoined: false,
        members: [
            { alt: 'Tom' },
            { alt: 'Nancy' }
        ],
        nextMeeting: '1 week'
    }
];

const CATEGORIES = ['All', 'My Clubs', 'Sci-Fi', 'Fantasy', 'Mystery', 'Romance', 'Non-Fiction'];

export default function ClubsPage() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [clubs, setClubs] = useState(MOCK_CLUBS);
    const [isLoading] = useState(false);
    const [showCreateModal, toggleCreateModal] = useToggle(false);

    // Filter clubs based on category
    const filteredClubs = clubs.filter(club => {
        if (selectedCategory === 'All') return true;
        if (selectedCategory === 'My Clubs') return club.isJoined;
        return club.category === selectedCategory;
    });

    // Handle join/leave club
    const handleToggleJoin = (clubId: string) => {
        setClubs(prev => prev.map(club =>
            club.id === clubId
                ? { ...club, isJoined: !club.isJoined, memberCount: club.isJoined ? club.memberCount - 1 : club.memberCount + 1 }
                : club
        ));
    };

    const joinedClubsCount = clubs.filter(c => c.isJoined).length;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-white min-h-screen pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 glass-header px-4 pt-12 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Reading Clubs</h1>
                        <p className="text-white/60 text-sm">
                            {joinedClubsCount > 0
                                ? `You're in ${joinedClubsCount} club${joinedClubsCount > 1 ? 's' : ''}`
                                : 'Join a club to start reading together'}
                        </p>
                    </div>
                    <button
                        onClick={toggleCreateModal}
                        className="size-10 rounded-full flex items-center justify-center bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                        aria-label="Create new club"
                    >
                        <span className="material-symbols-outlined">add</span>
                    </button>
                </div>
            </header>

            {/* Category Pills */}
            <div className="px-4 py-4">
                <div className="flex gap-3 overflow-x-auto no-scrollbar" role="listbox" aria-label="Filter by category">
                    {CATEGORIES.map((category) => (
                        <Chip
                            key={category}
                            selected={selectedCategory === category}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category === 'My Clubs' && joinedClubsCount > 0 ? `My Clubs (${joinedClubsCount})` : category}
                        </Chip>
                    ))}
                </div>
            </div>

            {/* Clubs List */}
            <main className="px-4 pb-8 space-y-4">
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <ClubCardSkeleton key={i} />
                    ))
                ) : filteredClubs.length === 0 ? (
                    <EmptyState
                        icon={selectedCategory === 'My Clubs' ? 'group_off' : 'search_off'}
                        title={selectedCategory === 'My Clubs' ? "You haven't joined any clubs yet" : 'No clubs found'}
                        description={selectedCategory === 'My Clubs'
                            ? 'Join a club to read and discuss books with others'
                            : `No clubs in the ${selectedCategory} category`}
                        action={selectedCategory === 'My Clubs' ? {
                            label: 'Explore Clubs',
                            onClick: () => setSelectedCategory('All')
                        } : undefined}
                    />
                ) : (
                    filteredClubs.map((club, index) => (
                        <Card
                            key={club.id}
                            variant="glass"
                            className="overflow-hidden animate-fade-in"
                            style={{ animationDelay: `${index * 75}ms` } as React.CSSProperties}
                        >
                            {/* Club Cover Image */}
                            <div className="relative h-32 overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-center bg-cover"
                                    style={{ backgroundImage: `url("${club.cover}")` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent" />
                                <div className="absolute top-3 right-3">
                                    <Badge variant={club.isJoined ? 'success' : 'default'}>
                                        {club.isJoined ? 'Joined' : club.category}
                                    </Badge>
                                </div>
                            </div>

                            {/* Club Info */}
                            <div className="p-4 -mt-8 relative">
                                <h3 className="text-lg font-bold text-white mb-1">{club.name}</h3>
                                <p className="text-white/60 text-sm line-clamp-2 mb-4">{club.description}</p>

                                {/* Current Book */}
                                <div className="flex items-center gap-2 mb-4 p-3 bg-white/5 rounded-xl">
                                    <span className="material-symbols-outlined text-primary text-lg">auto_stories</span>
                                    <div>
                                        <p className="text-[10px] text-white/40 uppercase tracking-wider">Currently Reading</p>
                                        <p className="text-sm font-medium text-white">{club.currentBook}</p>
                                    </div>
                                </div>

                                {/* Club Stats */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <AvatarGroup avatars={club.members} max={4} size="sm" />
                                        <span className="text-white/60 text-xs">{club.memberCount.toLocaleString()} members</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-white/40 text-xs">
                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                        Next: {club.nextMeeting}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button
                                        variant={club.isJoined ? 'secondary' : 'primary'}
                                        onClick={() => handleToggleJoin(club.id)}
                                        fullWidth
                                        leftIcon={
                                            <span className="material-symbols-outlined text-lg">
                                                {club.isJoined ? 'check' : 'group_add'}
                                            </span>
                                        }
                                    >
                                        {club.isJoined ? 'Joined' : 'Join Club'}
                                    </Button>
                                    {club.isJoined && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => navigate(`/clubs/${club.id}`)}
                                            aria-label="View club details"
                                        >
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </main>

            {/* Floating Create Button (Mobile) */}
            <button
                onClick={toggleCreateModal}
                className="fixed bottom-24 right-4 md:hidden size-14 rounded-full bg-gradient-to-tr from-primary to-purple-600 text-white shadow-lg flex items-center justify-center active:scale-90 transition-transform"
                aria-label="Create new club"
            >
                <span className="material-symbols-outlined text-2xl">add</span>
            </button>

            {/* Create Club Modal (Simple placeholder) */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <Card variant="glass" className="w-full max-w-md p-6 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Create a Club</h2>
                            <button
                                onClick={toggleCreateModal}
                                className="size-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                                aria-label="Close modal"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>
                        <p className="text-white/60 mb-6">
                            Start your own reading club and invite others to join your literary journey.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="text-primary text-xs font-bold uppercase tracking-widest block mb-2">Club Name</label>
                                <input
                                    className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                                    placeholder="Enter club name..."
                                />
                            </div>
                            <div>
                                <label className="text-primary text-xs font-bold uppercase tracking-widest block mb-2">Category</label>
                                <select className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary/50 outline-none transition-all">
                                    <option value="">Select category</option>
                                    <option value="Sci-Fi">Sci-Fi</option>
                                    <option value="Fantasy">Fantasy</option>
                                    <option value="Mystery">Mystery</option>
                                    <option value="Romance">Romance</option>
                                    <option value="Non-Fiction">Non-Fiction</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-primary text-xs font-bold uppercase tracking-widest block mb-2">Description</label>
                                <textarea
                                    className="w-full min-h-24 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all resize-none"
                                    placeholder="Tell people what your club is about..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button variant="secondary" onClick={toggleCreateModal} fullWidth>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={toggleCreateModal} fullWidth>
                                Create Club
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
