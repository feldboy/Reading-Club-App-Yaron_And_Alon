import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, AvatarGroup, Chip, EmptyState, ClubCardSkeleton } from '../components/ui';
import { useToggle } from '../hooks';
import { getClubs, joinClub, createClub, type Club } from '../services/clubs.api';
import { useAuth } from '../context/AuthContext';

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
    useEffect(() => {
        const fetchClubs = async () => {
            setIsLoading(true);
            try {
                const data = await getClubs();
                // Map backend data to UI expected format
                const processedClubs = data.map(club => ({
                    ...club,
                    id: club._id, // Map _id to id
                    memberCount: club.members.length,
                    // Check membership - handle populate vs raw ID
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

        fetchClubs();
    }, [user]);

    // Filter clubs based on category
    const filteredClubs = clubs.filter(club => {
        if (selectedCategory === 'All') return true;
        if (selectedCategory === 'My Clubs') return (club as any).isJoined;
        return club.category === selectedCategory;
    });

    // Handle join/leave club
    const handleToggleJoin = async (clubId: string) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            // Optimistic update
            setClubs(prev => prev.map(club => {
                if (club._id === clubId) {
                    const isJoined = !(club as any).isJoined;
                    return {
                        ...club,
                        isJoined,
                        memberCount: isJoined ? club.memberCount + 1 : club.memberCount - 1
                    } as Club;
                }
                return club;
            }));

            await joinClub(clubId);
            // Ideally re-fetch or use returned data
        } catch (error) {
            console.error('Failed to join club:', error);
            // Revert on error could be implemented here
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
                    src: m.profilePicture || '/uploads/profiles/default-avatar.png',
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
