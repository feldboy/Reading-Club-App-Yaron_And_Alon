import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, AvatarGroup, Chip, EmptyState, ClubCardSkeleton } from '../components/ui';
import { useToggle } from '../hooks';
import { getClubs, joinClub, leaveClub, createClub, type Club } from '../services/clubs.api';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_AVATAR } from '../utils/imageUtils';

const CATEGORIES = ['All', 'My Clubs', 'Sci-Fi', 'Fantasy', 'Mystery', 'Romance', 'Non-Fiction'];

export default function ClubsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, toggleCreateModal] = useToggle(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    // Create club form state
    const [clubName, setClubName] = useState('');
    const [clubCategory, setClubCategory] = useState('');
    const [clubDescription, setClubDescription] = useState('');
    const [clubIsPrivate, setClubIsPrivate] = useState(false);

    // Fetch clubs
    const fetchClubs = async () => {
        setIsLoading(true);
        try {
            const data = await getClubs();
            const processedClubs = data.map(club => ({
                ...club,
                id: club._id,
                memberCount: club.members.length,
                isJoined: user ? club.members.some((m: any) => (m._id === user.id || m === user.id)) : false,
                members: club.members.map((m: any) => ({
                    alt: m.username || 'Member',
                    src: m.profilePicture
                }))
            }));
            setClubs(processedClubs);
        } catch (error) {
            console.error('Failed to load clubs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClubs();
    }, [user]);

    // Filter clubs based on category
    const filteredClubs = clubs.filter(club => {
        if (selectedCategory === 'All') return true;
        if (selectedCategory === 'My Clubs') return (club as any).isJoined;
        return club.category === selectedCategory;
    });

    // Handle join/leave club toggle
    const handleToggleJoin = async (clubId: string) => {
        if (!user) {
            navigate('/login');
            return;
        }

        const club = clubs.find(c => c._id === clubId);
        const isCurrentlyJoined = (club as any)?.isJoined;

        try {
            // Optimistic update
            setClubs(prev => prev.map(c => {
                if (c._id === clubId) {
                    const isJoined = !isCurrentlyJoined;
                    return {
                        ...c,
                        isJoined,
                        memberCount: isJoined ? c.memberCount + 1 : c.memberCount - 1
                    } as Club;
                }
                return c;
            }));

            if (isCurrentlyJoined) {
                await leaveClub(clubId);
            } else {
                await joinClub(clubId);
            }
        } catch (error) {
            console.error('Failed to toggle club membership:', error);
            // Revert optimistic update on error
            fetchClubs();
        }
    };

    const joinedClubsCount = clubs.filter(c => (c as any).isJoined).length;

    /**
     * Handle create club form submission
     */
    const handleCreateClub = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCreateError(null);

        if (!clubName.trim() || !clubCategory || !clubDescription.trim()) {
            setCreateError('Please fill in all required fields');
            return;
        }

        if (!user) {
            setCreateError('Please login to create a club');
            return;
        }

        setIsCreating(true);
        try {
            const newClub = await createClub({
                name: clubName.trim(),
                category: clubCategory,
                description: clubDescription.trim(),
                isPrivate: clubIsPrivate,
                cover: '', // Optional, can be added later
            });

            // Add new club to the list
            const processedClub = {
                ...newClub,
                id: newClub._id,
                memberCount: newClub.members.length,
                isJoined: true, // Creator is automatically a member
                members: newClub.members.map((m: any) => ({
                    alt: m.username || 'Member',
                    src: m.profilePicture || DEFAULT_AVATAR,
                })),
            };
            setClubs([processedClub, ...clubs]);

            // Reset form and close modal
            setClubName('');
            setClubCategory('');
            setClubDescription('');
            setClubIsPrivate(false);
            toggleCreateModal();
        } catch (err: any) {
            console.error('Failed to create club:', err);
            setCreateError(err.response?.data?.message || 'Failed to create club. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#1a0f2e] font-[Libre_Baskerville] text-white min-h-screen pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#1a0f2e]/80 border-b border-white/5 px-4 sm:px-6 pt-6 pb-5 shadow-lg shadow-black/10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="font-[Cormorant_Garamond] text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2 tracking-tight">
                                Reading Clubs
                            </h1>
                            <p className="text-purple-300/70 text-sm sm:text-base font-light">
                                {joinedClubsCount > 0
                                    ? `You're in ${joinedClubsCount} club${joinedClubsCount > 1 ? 's' : ''}`
                                    : 'Join a club to start reading together'}
                            </p>
                        </div>
                        <button
                            onClick={toggleCreateModal}
                            className="group relative flex-shrink-0 size-12 sm:size-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] hover:from-[#6D28D9] hover:to-[#9270F0] transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a0f2e]"
                            aria-label="Create new club"
                        >
                            <span className="material-symbols-outlined text-2xl sm:text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Category Pills */}
            <div className="px-4 sm:px-6 py-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1 scroll-smooth" role="listbox" aria-label="Filter by category">
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
            </div>

            {/* Clubs List */}
            <main className="px-4 sm:px-6 pb-8 space-y-4 max-w-7xl mx-auto">
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
                            key={club._id}
                            variant="glass"
                            className="overflow-hidden animate-fade-in"
                            style={{ animationDelay: `${index * 75}ms` } as React.CSSProperties}
                        >
                            {/* Club Cover Image */}
                            <div className="relative h-32 overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-center bg-cover"
                                    role="img"
                                    aria-label={`${club.name} club cover image`}
                                    style={{ backgroundImage: `url("${club.cover || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop'}")` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent" />
                                <div className="absolute top-3 right-3">
                                    <Badge variant={(club as any).isJoined ? 'success' : 'default'}>
                                        {(club as any).isJoined ? 'Joined' : club.category}
                                    </Badge>
                                </div>
                            </div>

                            {/* Club Info */}
                            <div className="p-4 -mt-8 relative">
                                <h3 className="text-lg font-bold text-white mb-1">{club.name}</h3>
                                <p className="text-white/60 text-sm line-clamp-2 mb-4">{club.description}</p>

                                {/* Current Book */}
                                {club.currentBook && (
                                    <div className="flex items-center gap-2 mb-4 p-3 bg-white/5 rounded-xl">
                                        <span className="material-symbols-outlined text-primary text-lg">auto_stories</span>
                                        <div>
                                            <p className="text-[10px] text-white/40 uppercase tracking-wider">Currently Reading</p>
                                            <p className="text-sm font-medium text-white">{club.currentBook}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Club Stats */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <AvatarGroup avatars={club.members} max={4} size="sm" />
                                        <span className="text-white/60 text-xs">{club.memberCount.toLocaleString()} members</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-white/40 text-xs">
                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                        Next: {club.nextMeeting || 'TBA'}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button
                                        variant={(club as any).isJoined ? 'secondary' : 'primary'}
                                        onClick={() => handleToggleJoin(club._id)}
                                        fullWidth
                                        leftIcon={
                                            <span className="material-symbols-outlined text-lg">
                                                {(club as any).isJoined ? 'check' : 'group_add'}
                                            </span>
                                        }
                                    >
                                        {(club as any).isJoined ? 'Joined' : 'Join Club'}
                                    </Button>
                                    {(club as any).isJoined && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => navigate(`/clubs/${club._id}`)}
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

            {/* Create Club Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <Card variant="glass" className="w-full max-w-md p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">Create a Club</h2>
                            <button
                                onClick={toggleCreateModal}
                                disabled={isCreating}
                                className="size-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-50"
                                aria-label="Close modal"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                        </div>
                        <p className="text-white/60 mb-6">
                            Start your own reading club and invite others to join your literary journey.
                        </p>
                        <form onSubmit={handleCreateClub}>
                            {createError && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                    {createError}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="clubName" className="text-primary text-xs font-bold uppercase tracking-widest block mb-2">
                                        Club Name *
                                    </label>
                                    <input
                                        id="clubName"
                                        type="text"
                                        value={clubName}
                                        onChange={(e) => setClubName(e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all"
                                        placeholder="Enter club name..."
                                        required
                                        maxLength={50}
                                        disabled={isCreating}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="clubCategory" className="text-primary text-xs font-bold uppercase tracking-widest block mb-2">
                                        Category *
                                    </label>
                                    <select
                                        id="clubCategory"
                                        value={clubCategory}
                                        onChange={(e) => setClubCategory(e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-primary/50 outline-none transition-all"
                                        required
                                        disabled={isCreating}
                                    >
                                        <option value="">Select category</option>
                                        <option value="Sci-Fi">Sci-Fi</option>
                                        <option value="Fantasy">Fantasy</option>
                                        <option value="Mystery">Mystery</option>
                                        <option value="Romance">Romance</option>
                                        <option value="Thriller">Thriller</option>
                                        <option value="Non-Fiction">Non-Fiction</option>
                                        <option value="Fiction">Fiction</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="clubDescription" className="text-primary text-xs font-bold uppercase tracking-widest block mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        id="clubDescription"
                                        value={clubDescription}
                                        onChange={(e) => setClubDescription(e.target.value)}
                                        className="w-full min-h-24 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none transition-all resize-none"
                                        placeholder="Tell people what your club is about..."
                                        required
                                        maxLength={500}
                                        disabled={isCreating}
                                    />
                                    <p className="text-white/40 text-xs mt-1">{clubDescription.length}/500</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        id="clubIsPrivate"
                                        type="checkbox"
                                        checked={clubIsPrivate}
                                        onChange={(e) => setClubIsPrivate(e.target.checked)}
                                        className="size-5 rounded bg-white/5 border border-white/10 checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary/30"
                                        disabled={isCreating}
                                    />
                                    <label htmlFor="clubIsPrivate" className="text-white/80 text-sm cursor-pointer">
                                        Make this club private
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setClubName('');
                                        setClubCategory('');
                                        setClubDescription('');
                                        setClubIsPrivate(false);
                                        setCreateError(null);
                                        toggleCreateModal();
                                    }}
                                    fullWidth
                                    disabled={isCreating}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    fullWidth
                                    disabled={isCreating || !clubName.trim() || !clubCategory || !clubDescription.trim()}
                                >
                                    {isCreating ? 'Creating...' : 'Create Club'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
